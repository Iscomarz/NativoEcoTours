import {
	getExperienciaSlug,
	getDetalleExperiencia,
	getHabitacionesExperiencia
} from '$lib/core/controllers/experiencias.service.js';

export async function load({ params }) {
	const experiencia = await getExperienciaSlug(params.experiencia);

	const detalle = await getDetalleExperiencia(experiencia.id);
	let habitaciones = await getHabitacionesExperiencia(experiencia.id);

	habitaciones = habitaciones.map((hab) => ({
		...hab,
		slot: `${hab.idexperiencia}-${hab.nombre.replace(/\s+/g, '-')}`
	}));

	experiencia.detalle = detalle;
	experiencia.habitaciones = habitaciones;

	return { slug: params.experiencia, experiencia };
}
