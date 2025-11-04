import { supabase } from '$lib/core/supabase/client.js';
import { getExperiencias, getExperienciaActiva } from '$lib/core/controllers/experiencias.service.js';
import { getUbicacionesDestacadas } from '$lib/core/controllers/ubicaciones.service';

export const load = async () => {
	const {
		data: { session }
	} = await supabase.auth.getSession();

	//traer experiencias

	let experiencias = await getExperiencias();

	experiencias = experiencias.map((exp) => ({
		...exp,
		experiencia: exp.titulo.replace(/\s+/g, '-')
	}));

	//traer ubicaciones
	let ubicaciones = await getUbicacionesDestacadas();

	//traer experiencia activa
	let experienciaActiva = await getExperienciaActiva();
	console.log('Experiencia Activa:', experienciaActiva);

	return {
		props: {
			session,
			experiencias,
			ubicaciones,
			experienciaActiva
		}
	};
};
