import {getHabitacionByExperiencia} from '$lib/core/controllers/experiencias.service.js';


export async function load({ params}) {
    const { slot } = params;

    const habitacion = await getHabitacionByExperiencia(slot);

    return {
        props: {
            habitacion
        }
    };
}