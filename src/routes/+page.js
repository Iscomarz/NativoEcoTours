import { getUbicacionesDestacadas } from "$lib/core/controllers/ubicaciones.service";
import { getHeroVideoUrl } from "$lib/core/controllers/configuracion.service";

export let load = async () => {
    const [ubicaciones, heroVideoUrl] = await Promise.all([
        getUbicacionesDestacadas(),
        getHeroVideoUrl()
    ]);

    return {
        props: {
            ubicaciones,
            heroVideoUrl
        }
    };
};
