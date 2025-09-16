import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/core/supabase/client.js';

export const load = async () => {
	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (session) {
		throw redirect(303, '/');
	}
};

export const actions = {
	register: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData);
		// Extraer campos del formulario
		const nombre = formData.get('nombre'); // 
		const apellido = formData.get('apellido'); // 
		const pais = formData.get('pais'); //
		const estado = formData.get('estado'); //
		const correo = formData.get('correo'); //
		const password = formData.get('password'); //
		const telefono = formData.get('telefono'); //

		if (!nombre || !apellido || !pais || !correo || !password || !telefono) {
			return fail(400, { error: 'Todos los campos son obligatorios.' });
		}

		// 1️⃣ Crear usuario en Supabase Auth
		const { data, error } = await supabase.auth.signUp({
			email: correo,
			password,
			options: {
				emailRedirectTo: 'http://localhost:5173/login' // Ajusta según tu entorno
			}
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		const user = data.user;
		if (!user) {
			return fail(500, { error: 'No se pudo crear el usuario en Auth.' });
		}

		console.log('Usuario creado en Auth:', user);

		// 2️⃣ Insertar en tu tabla susuario
		const { error: insertError } = await supabase.from('susuario').insert([
			{
				nombre,
				apellido,
				telefono,
				pais,
				estado,
				correo,
				idAuth: user.id // Relacionar con el ID de Auth
			}
		]);
		if (insertError) {
			console.error('Error insertando en susuario:', insertError);
			return fail(500, { error: 'Usuario creado en Auth, pero error en susuario.' });
		}

		// 3️⃣ Redirigir al login (o loguearlo directamente)
		throw redirect(303, '/login');
	},

	logout: async ({ cookies }) => {
		// Cierra la sesión en Supabase
		await supabase.auth.signOut();
		// Opcional: limpiar cookies si usas tokens personalizados
		throw redirect(303, '/login');
	},

	login: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		const {
			data: { user },
			errorA: userError
		} = await supabase.auth.getUser();

		if (userError || !user) {
			return fail(401, { error: 'Usuario no autenticado.' });
		}

		// si quieres proteger rutas puedes guardar la sesión en cookies aquí
		throw redirect(303, '/');
	}
};
