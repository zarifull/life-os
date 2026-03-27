import { supabase } from '@/lib/supabase';

const handleLogin = async (email : string, password : string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  
    if (error) {
      console.error("Ката кетти:", error.message);
    } else {
      // Redirect to dashboard
      window.location.href = "/dashboard";
    }
  };