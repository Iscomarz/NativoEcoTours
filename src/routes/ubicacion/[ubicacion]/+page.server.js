import { getUbicacionByNombre, getDetalleUbicacion } from "$lib/core/controllers/ubicaciones.service";

export async function load({ params }) {
    const ubicacion = await getUbicacionByNombre(params.ubicacion);
    const detalle = await getDetalleUbicacion(ubicacion.id_ubicacion);

    return {
        ubicacion,
        detalle
    };
}