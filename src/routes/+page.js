import { getUbicacionesDestacadas } from "$lib/core/controllers/ubicaciones.service";

export let load = async () => {
    let ubicaciones = await getUbicacionesDestacadas();

    return {
        props:{
            ubicaciones
        }
    }
}