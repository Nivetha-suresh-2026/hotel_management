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
    // getSession() seeds state if onAuthStateChange hasn't fired yet.
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      // Only act if no auth event has already initialized state
      if (initializedRef.current) return;
      initializedRef.current = true;
      console.log('AuthContext: getSession fallback resolved');
      setSession(s);
      setUser(s?.user ?? null);
      unblock(); // unblock immediately — profile loads in background
      if (s?.user) {
        fetchProfile(s.user.id);
      }
    }).catch((err) => {
      console.error('AuthContext: getSession threw', err);
      // Even on error, unblock if nothing else has
      if (mounted && !initializedRef.current) { initializedRef.current = true; unblock(); }
    });

    // ── Primary: onAuthStateChange ───────────────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return;
        console.log('AuthContext:', event);

        // ── First event of any kind — seed state and unblock ─────────────
        // Extensions sometimes suppress INITIAL_SESSION and fire SIGNED_IN
        // instead. We treat the very first event (regardless of type) as the
        // initialization signal so the spinner always clears.
        if (!initializedRef.current) {
          initializedRef.current = true;
          setSession(s);
          setUser(s?.user ?? null);
          if (!s?.user) {
            setRole(null);
            setProfile(null);
            loadedUidRef.current = null;
          }
          unblock(); // unblock immediately — profile loads in background
          if (s?.user) {
            fetchProfile(s.user.id);
          }
          return;
        }

        // ── Subsequent events (TOKEN_REFRESHED, SIGNED_OUT, etc.) ────────
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
