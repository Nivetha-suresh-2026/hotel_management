import { supabase } from '../lib/supabaseClient';

/**
 * Sign in a user with email and password using Supabase Auth.
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

/**
 * Get the user's role from the public 'users' table.
 */
export const getUserRole = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', userId)
    .single();

  if (error) throw error;
  return data?.role;
};

/**
 * Sign out the current user.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};