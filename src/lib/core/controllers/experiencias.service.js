import { supabase } from "../supabase/client";

export async function getExperiencias() {

    const { data, error } = await supabase
        .from('cexperiencia')
        .select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
}


export async function getExperienciaByTitulo(titulo){
    const nombre = titulo.replace(/-/g, ' ');

    const { data, error } = await supabase
        .from('cexperiencia')
        .select('*')
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
        .eq('idexperiencia', idexperiencia)
        .order('capacidad', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    //filtrar por capacidad
    const unicosPorCapacidad = [];
    const capacidadesIncluidas = new Set();

    for (const habitacion of data) {
        if (!capacidadesIncluidas.has(habitacion.capacidad)) {
            capacidadesIncluidas.add(habitacion.capacidad);
            unicosPorCapacidad.push(habitacion);
        }
    }
    return unicosPorCapacidad;
}

export async function getHabitacionesByExperiencia(id, cantidad) {

    const { data, error } = await supabase
        .from('chabitacion')
        .select('*')
        .eq('idexperiencia', id)
        .eq('capacidad', cantidad);


    if (error) {
        throw new Error(error.message);
    }

    return data;
}
