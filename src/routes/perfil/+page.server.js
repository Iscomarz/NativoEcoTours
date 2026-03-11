import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { user, supabase } }) => {
	if (!user) {
		throw redirect(303, '/login');
	}

	const { data: profile } = await supabase
		.from('susuario')
		.select('*')
		.eq('idAuth', user.id)
		.single();
	
	return {
		user,
		user_profile: profile
	};
};

export const actions = {
	update: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const { data: { user }, error: userError } = await supabase.auth.getUser();

		if (userError || !user) {
			return fail(401, { error: 'No autorizado' });
		}

		console.log("🛠️ Intentando actualizar usuario:", user.email, "con ID:", user.id);

		const nombre = formData.get('nombre');
		const apellido = formData.get('apellido');
		const telefonoRaw = formData.get('telefono');
		const pais = formData.get('pais');
		const estado = formData.get('estado');
		const telefono = telefonoRaw ? telefonoRaw.toString().replace(/\D/g, '') : null;

		// 1️⃣ Intentamos actualizar buscando por idAuth (estándar)
		const { data, error } = await supabase
			.from('susuario')
			.update({
				nombre,
				apellido,
				telefono: telefono ? parseFloat(telefono) : null,
				pais,
				estado
			})
			.eq('idAuth', user.id)
			.select();

		if (error) {
			console.error('❌ Error de Postgres:', error.message);
			return fail(400, { error: error.message });
		}

		if (!data || data.length === 0) {
			console.error('❌ Error: No se encontró el registro para actualizar.');
			return fail(404, { error: 'No se encontró tu perfil.' });
		}

		console.log('✅ Éxito! Usuario actualizado y vinculado:', data[0].nombre);
		return { success: true };
	}
};
