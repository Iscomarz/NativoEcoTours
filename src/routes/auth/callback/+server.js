import { redirect } from '@sveltejs/kit';
import { sendWelcomeEmail } from '$lib/server/email.js';
import { getSupabaseAdmin } from '$lib/server/supabaseAdmin.js';

export const GET = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			const user = data?.session?.user || data?.user;
			
			// Si es el primer acceso y no se ha enviado el correo de bienvenida
			if (user && user.email && !user.user_metadata?.welcome_sent) {
				try {
					const supabaseAdmin = getSupabaseAdmin();
					const nombre = user.user_metadata?.full_name || 
					               user.user_metadata?.name || 
					               user.user_metadata?.nombre || 
					               user.email.split('@')[0];

					// Marcar en user_metadata para garantizar idempotencia
					await supabaseAdmin.auth.admin.updateUserById(user.id, {
						user_metadata: {
							...user.user_metadata,
							welcome_sent: true
						}
					});

					// Disparar correo de bienvenida
					await sendWelcomeEmail({
						email: user.email,
						nombre
					});
					console.log(`✉️ Correo de bienvenida enviado a ${user.email}`);
				} catch (errWelcome) {
					console.error('Error al procesar correo de bienvenida:', errWelcome);
				}
			}

			throw redirect(303, next);
		}
		console.error('Auth error:', error);
	}

	// Si hay error o no hay code, regresamos al login
	throw redirect(303, '/login?error=auth_callback_failed');
};
