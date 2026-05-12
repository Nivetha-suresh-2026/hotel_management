import { createContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [session, setSession] = useState(null);
  const [role,    setRole]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadedUidRef    = useRef(null);
  const initializedRef  = useRef(false); // prevent double-init from fallback + event

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', userId)
          .maybeSingle();

        if (!mounted) return;
        if (error) { console.error('AuthContext: profile fetch error', error); return; }

        if (data) {
          const appRole = data.role === 'hotel_owner' ? 'owner' : 'admin';
          setProfile(data);
          setRole(appRole);
          loadedUidRef.current = userId;
        } else {
          setProfile(null);
          setRole(null);
          loadedUidRef.current = null;
        }
      } catch (err) {
        console.error('AuthContext: fetchProfile threw', err);
      }
    };

    const unblock = () => {
      if (mounted) { setLoading(false); }
    };

    // ── Fallback: getSession() resolves instantly from localStorage ──────
    // Browser extensions (McAfee, ASUS, etc.) can block the BroadcastChannel
    // that Supabase uses to deliver INITIAL_SESSION, leaving the app stuck.
    // We race getSession() against onAuthStateChange — whichever fires first
    // seeds the state; the other is a no-op due to initializedRef.
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!mounted || initializedRef.current) return;
      initializedRef.current = true;
      console.log('AuthContext: getSession fallback resolved');
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        await fetchProfile(s.user.id);
      }
      unblock();
    }).catch((err) => {
      console.error('AuthContext: getSession threw', err);
      if (mounted && !initializedRef.current) { initializedRef.current = true; unblock(); }
    });

    // ── Primary: onAuthStateChange ───────────────────────────────────────
    // Supabase v2 fires INITIAL_SESSION on mount with the persisted session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return;
        console.log('AuthContext:', event);

        if (event === 'INITIAL_SESSION') {
          // Only seed from the event if the getSession() fallback hasn't already run
          if (!initializedRef.current) {
            initializedRef.current = true;
            setSession(s);
            setUser(s?.user ?? null);
            if (s?.user) {
              await fetchProfile(s.user.id);
            }
          }
          unblock();
          return;
        }

        // All subsequent events (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.)
        setSession(s);
        setUser(s?.user ?? null);

        if (s?.user) {
          if (event === 'TOKEN_REFRESHED' && loadedUidRef.current === s.user.id) {
            // profile/role are already correct — skip redundant DB fetch
          } else {
            await fetchProfile(s.user.id);
          }
        } else {
          setRole(null);
          setProfile(null);
          loadedUidRef.current = null;
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); setSession(null); setRole(null); setProfile(null);
    loadedUidRef.current = null;
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, session, role, profile, loading }}>
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
          <div style={{ textAlign:'center', fontFamily:'sans-serif' }}>
            <div style={{
              width: 40, height: 40,
              border: '4px solid #e2e8f0', borderTop: '4px solid #4f46e5',
              borderRadius: '50%', margin: '0 auto 1rem',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color:'#64748b' }}>Loading Hostay...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};
