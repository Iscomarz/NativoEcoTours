import { supabaseServer } from '$lib/core/supabase/server.js';

export const handle = async ({ event, resolve }) => {
	const supabase = supabaseServer(event);

	// Usamos getUser() exclusivamente para evitar la advertencia de seguridad
	const { data: { user } } = await supabase.auth.getUser();

	event.locals.supabase = supabase;
	event.locals.user = user;
	event.locals.session = user ? { user } : null;

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
