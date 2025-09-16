import { supabaseServer } from '$lib/core/supabase/server.js';

export const handle = async ({ event, resolve }) => {
  const supabase = supabaseServer(event);

  // Obtenemos la sesión del request (cookies)
  const {
    data: { session }
  } = await supabase.auth.getSession();

  // Guardamos en locals para SSR
  event.locals.supabase = supabase;
  event.locals.session = session;

  return resolve(event);
};
