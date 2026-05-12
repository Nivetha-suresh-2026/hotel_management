import { supabase } from './src/lib/supabaseClient.js';

async function checkUsers() {
  const { data: { user } } = await supabase.auth.getUser();
  console.log("Auth User ID:", user?.id);
  
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', user?.id)
    .single();
    
  if (error) {
    console.error("Profile Error:", error);
  } else {
    console.log("Profile Data:", JSON.stringify(profile, null, 2));
  }
}

checkUsers();
