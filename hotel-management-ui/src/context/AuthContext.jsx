import { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    console.log("AuthContext: Initialization started...");
    
    // Failsafe: Force loading to false after 8 seconds (increased from 3s for cold starts)
    const failsafe = setTimeout(() => {
      if (mounted) {
        console.warn("AuthContext: Initialization timed out. Forcing loading to false.");
        setLoading(false);
      }
    }, 8000);

    const fetchUserRole = async (userId) => {
      try {
        console.log("AuthContext: Fetching role via direct query for UID:", userId);
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("auth_id", userId)
          .maybeSingle();

        if (!mounted) return;

        if (error) {
          console.error("AuthContext: Role fetch failed:", error);
          setRole(null);
          return;
        }

        if (!data) {
          console.warn("AuthContext: No profile found for user:", userId);
          setRole(null);
          return;
        }

        console.log("AuthContext: Role received:", data?.role);
        const userRole = data?.role;
        if (userRole === 'hotel_owner') {
          setRole('owner');
        } else if (userRole === 'admin') {
          setRole('admin');
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error('AuthContext: Unexpected error in fetchUserRole:', error);
        if (mounted) setRole(null);
      }
    };

    const setData = async () => {
      try {
        console.log("AuthContext: Fetching session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
        
        if (session?.user && mounted) {
          await fetchUserRole(session.user.id);
        }
      } catch (error) {
        console.error('AuthContext Initialization Error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(failsafe);
          console.log("AuthContext: Initialization complete.");
        }
      }
    };

    setData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("AuthContext: Auth state changed:", _event);
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setRole(null);
      }
      
      setLoading(false);
      clearTimeout(failsafe);
    });

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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    localStorage.removeItem('userRole');
  };

  const value = {
    signIn,
    signOut,
    user,
    session,
    role,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#4f46e5' }}>Hostay</h2>
            <p style={{ color: '#64748b' }}>System Initializing...</p>
          </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};
