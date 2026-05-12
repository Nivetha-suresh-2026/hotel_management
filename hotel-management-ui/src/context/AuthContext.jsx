import { createContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [session, setSession] = useState(null);
  const [role,    setRole]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadedUidRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    // Safety net: if INITIAL_SESSION never fires (e.g. network issue), unblock UI after 5s
    const failsafe = setTimeout(() => {
      if (mounted) {
        console.warn('AuthContext: failsafe — INITIAL_SESSION never fired');
        setLoading(false);
      }
    }, 5000);

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

    // ── Single source of truth: onAuthStateChange ────────────────────────
    // Supabase v2 fires INITIAL_SESSION on mount with the persisted session.
    // We handle ALL events here — do NOT use getSession() in parallel.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return;
        console.log('AuthContext:', event);

        setSession(s);
        setUser(s?.user ?? null);

        if (s?.user) {
          // TOKEN_REFRESHED = same user, new JWT — skip redundant DB fetch
          if (event === 'TOKEN_REFRESHED' && loadedUidRef.current === s.user.id) {
            // profile/role are already correct
          } else {
            await fetchProfile(s.user.id);
          }
        } else {
          setRole(null);
          setProfile(null);
          loadedUidRef.current = null;
        }

        // Unblock the UI after the very first event (INITIAL_SESSION)
        if (event === 'INITIAL_SESSION') {
          if (mounted) { setLoading(false); clearTimeout(failsafe); }
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(failsafe);
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
