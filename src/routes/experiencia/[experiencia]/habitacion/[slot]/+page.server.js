import {getHabitacionesByExperiencia} from '$lib/core/controllers/experiencias.service.js';
import { error } from '@sveltejs/kit';

export async function load({ params, parent }) {
    const parentData = await parent();
    const {session} = parentData;

    const sesionActiva = session == null ? false : true;
  // params.slot viene como "123-habitacion-familiar"
  const raw = params.slot ?? '';

  // Captura el id (primer bloque de dígitos) y todo lo que viene después del primer guion
  const match = raw.match(/^(\d+)-(.+)$/);

  if (!match) {
    console.error(`Parámetro "slot" inválido: ${raw}`);
    // Si prefieres usar kitError reemplaza la siguiente línea por: throw kitError(400, `Parámetro "slot" inválido: ${raw}`);
    throw error(400, `Parámetro "slot" inválido: ${raw}`);
  }

  const id = Number(match[1]);
  if (Number.isNaN(id)) {
    console.error(`ID no numérico en "slot": ${raw}`);
    throw error(400, `ID inválido en "slot": ${raw}`);
  }

  // match[2] contiene el resto de la cadena después del primer guion.
  // Reemplazamos guiones por espacios para obtener "habitacion familiar"
  const nombre = match[2].replace(/-/g, ' ').trim();

  const habitaciones = await getHabitacionesByExperiencia(id, nombre);

  return {
    props: {
      habitaciones,
      sesionActiva
    }
  };
}
