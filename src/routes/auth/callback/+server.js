import { redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			throw redirect(303, next);
		}
		console.error('Auth error:', error);
	}

	// Si hay error o no hay code, regresamos al login
	throw redirect(303, '/login?error=auth_callback_failed');
};
