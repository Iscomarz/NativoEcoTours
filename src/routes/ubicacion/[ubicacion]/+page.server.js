import { getUbicacionByNombre, getDetalleUbicacion, getUbicacionesDestacadas } from "$lib/core/controllers/ubicaciones.service";

export async function load({ params }) {
    const ubicacion = await getUbicacionByNombre(params.ubicacion);
    const detalle = await getDetalleUbicacion(ubicacion.id_ubicacion);
    const ubicaciones = await getUbicacionesDestacadas();

    return {
        ubicacion,
        detalle,
        ubicaciones
    };
}