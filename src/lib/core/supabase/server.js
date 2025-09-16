import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabaseServer = (event) => {
  return createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      // Esto permite que el cliente server lea la cookie de sesión
      persistSession: false,
      detectSessionInUrl: false
    },
    global: {
      fetch: event.fetch
    }
  });
};
