import { supabase } from '$lib/core/supabase/client.js';
import { getExperiencias } from '$lib/core/controllers/experiencias.service.js';

export const load = async () => {
	const {
		data: { session }
	} = await supabase.auth.getSession();

	let experiencias = await getExperiencias();

	experiencias = experiencias.map((exp) => ({
		...exp,
		experiencia: exp.titulo.replace(/\s+/g, '-')
	}));

	return {
		props: {
			session,
			experiencias
		}
	};
};
