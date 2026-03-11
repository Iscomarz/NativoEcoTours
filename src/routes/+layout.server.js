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

	return {
		session,
		user_profile
	};
};
