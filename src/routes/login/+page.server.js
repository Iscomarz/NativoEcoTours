import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { session } }) => {
	if (session) {
		throw redirect(303, '/');
	}
};

export const actions = {
	register: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const nombre = formData.get('nombre');
		const apellido = formData.get('apellido');
		const pais = formData.get('pais');
		const estado = formData.get('estado');
		const correo = formData.get('correo');
		const password = formData.get('password');
		const telefono = formData.get('telefono');

		if (!nombre || !apellido || !pais || !correo || !password || !telefono) {
			return fail(400, { error: 'Todos los campos son obligatorios.' });
		}

		const { error } = await supabase.auth.signUp({
			email: correo,
			password,
			options: {
				emailRedirectTo: 'http://localhost:5173/auth/callback',
				data: {
					nombre,
					apellido,
					telefono,
					pais,
					estado
				}
			}
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		return { success: true, message: 'Revisa tu correo para verificar tu cuenta.' };
	},

	logout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		throw redirect(303, '/login');
	},

	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		throw redirect(303, '/');
	}
};
