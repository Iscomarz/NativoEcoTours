import {
	getExperienciaByTitulo,
	getDetalleExperiencia,
	getHabitacionesExperiencia
} from '$lib/core/controllers/experiencias.service.js';

export async function load({ params }) {
	const experiencia = await getExperienciaByTitulo(params.experiencia);

	const detalle = await getDetalleExperiencia(experiencia.id);
	let habitaciones = await getHabitacionesExperiencia(experiencia.id);

	habitaciones = habitaciones.map((hab) => ({
		...hab,
		ruta: `${hab.idexperiencia}-${hab.nombre.replace(/\s+/g, '-')}`
	}));

	experiencia.detalle = detalle;
	experiencia.habitaciones = habitaciones;

	return { ruta: params.experiencia, experiencia };
}
