import { supabase } from '$lib/core/supabase/client.js';
import { getExperiencias, getExperienciaActiva } from '$lib/core/controllers/experiencias.service.js';
import { getUbicacionesDestacadas } from '$lib/core/controllers/ubicaciones.service';

export const load = async () => {
	const {
		data: { session }
	} = await supabase.auth.getSession();

	//traer experiencias
	let experiencias = [];
	try {
		experiencias = await getExperiencias();
		experiencias = (experiencias || []).map((exp) => ({
			...exp,
			experiencia: exp.titulo.replace(/\s+/g, '-')
		}));
	} catch (e) {
		console.error('Error loading experiencias:', e);
	}

	//traer ubicaciones
	let ubicaciones = [];
	try {
		ubicaciones = await getUbicacionesDestacadas();
	} catch (e) {
		console.error('Error loading ubicaciones:', e);
	}

	//traer experiencia activa
	let experienciaActiva = null;
	try {
		experienciaActiva = await getExperienciaActiva();
	} catch (e) {
		console.error('Error loading active experience:', e);
	}

	return {
		props: {
			session,
			experiencias,
			ubicaciones,
			experienciaActiva
		}
	};
};
