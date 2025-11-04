import { supabase } from '../supabase/client';

export async function getExperienciaActiva(){
	const {data, error} = await supabase
	.from('cexperiencia')
	.select(`id,titulo,descripcion,fecha_inicio,fecha_fin,capacidad,activo,
			cubicacion (id_ubicacion,nombre_ubicacion,estado_ubicacion,pais_ubicacion)`)
	.eq('activo',true)
	.single();
	
	//traer el detalle de la experiencia activa

	const detalle = await getDetalleExperiencia(data.id);
	data.detalle = detalle;

	if (error) {
		throw new Error(error.message);
	}
	return data;
}

export async function getExperiencias() {
	const { data, error } = await supabase
	.from('cexperiencia')
	.select(`id,titulo,descripcion,fecha_inicio,fecha_fin,capacidad,activo,
			cubicacion (id_ubicacion,nombre_ubicacion,estado_ubicacion,pais_ubicacion)`);

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export async function getExperienciaByTitulo(titulo) {
	const nombre = titulo.replace(/-/g, ' ');

	const { data, error } = await supabase
		.from('cexperiencia')
		.select(`id,titulo,descripcion,fecha_inicio,fecha_fin,capacidad,activo,
			cubicacion(id_ubicacion,nombre_ubicacion,estado_ubicacion,pais_ubicacion)`)
		.eq('titulo', nombre)
		.single();

	if (error) {
		throw new Error(error.message);
	}
	return data;
}

export async function getDetalleExperiencia(idexperiencia) {
	const { data, error } = await supabase
		.from('dexperiencia')
		.select('*')
		.eq('idexperiencia', idexperiencia)
		.single();

	if (error) {
		throw new Error(error.message);
	}
	return data;
}

export async function getHabitacionesExperiencia(idexperiencia) {
	const { data, error } = await supabase
		.from('chabitacion')
		.select('*')
		.eq('idexperiencia', idexperiencia);

	if (error) {
		throw new Error(error.message);
	}
	return data;
}

export async function getHabitacionesByExperiencia(id, nombre) {
	const nombreNormalized = (nombre ?? '').replace(/-/g, ' ').trim();

const { data, error } = await supabase
  .from('dhabitacion')
  .select('* , chabitacion!inner(*)')
  .eq('chabitacion.idexperiencia', id)
  .eq('chabitacion.nombre', nombreNormalized);

	if (error) {
		console.error('Error al obtener habitaciones:', error);
		throw new Error(error.message);
	}

	return data;
}
