import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

export const supabaseServer = (event) => {
	return createServerClient(
		env.PUBLIC_SUPABASE_URL || '', 
		env.PUBLIC_SUPABASE_ANON_KEY || '', 
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);
};
