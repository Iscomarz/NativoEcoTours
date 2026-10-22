export const load = async ({ locals: { session, supabase } }) => {
	let user_profile = null;

	if (session?.user) {
		const { data: profile } = await supabase
			.from('susuario')
			.select('*')
			.eq('idAuth', session.user.id)
			.single();
		
		user_profile = profile;
	}

	let navbar_siempre_blanco = false;
	try {
		const { data: config } = await supabase
			.from('configuracion_sitio')
			.select('valor')
			.eq('clave', 'navbar_siempre_blanco')
			.maybeSingle();

		navbar_siempre_blanco = config?.valor === 'true';
	} catch (e) {
		console.error('Error cargando navbar_siempre_blanco:', e);
	}

	return {
		session,
		user_profile,
		navbar_siempre_blanco
	};
};
