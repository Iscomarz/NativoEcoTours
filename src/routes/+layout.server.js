// +layout.server.js
import { supabase } from '$lib/core/supabase/client.js';

export const load = async ({ locals }) => {
    const {
		data: { session }
	} = await supabase.auth.getSession();
    
  return {
    session: session, 
  };
};
