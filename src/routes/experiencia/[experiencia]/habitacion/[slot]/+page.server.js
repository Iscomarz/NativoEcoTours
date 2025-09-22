import {getHabitacionesByExperiencia} from '$lib/core/controllers/experiencias.service.js';


export async function load({ params}) {
    // params.slot viene como "123-habitacion-8"
    const raw = params.slot ?? '';
    const match = raw.match(/^(\d+)-habitacion-(\d+)$/);

    if (!match) {
        throw kitError(400, `Parámetro "slot" inválido: ${raw}`);
    }

    let id = Number(match[1]);
    let cantidad = Number(match[2]);

    const habitaciones = await getHabitacionesByExperiencia(id, cantidad);

    return {
        props: {
            habitaciones
        }
    };
}