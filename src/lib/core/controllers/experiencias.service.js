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


export async function getExperienciaSlug(slug){
    const nombre = slug.replace(/-/g, ' ');

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
        .eq('idexperiencia', idexperiencia);

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function getHabitacionByExperiencia(slot) {
    let id = slot.split('-')[0];
    let nombre = slot.split('-').slice(1).join('-').replace(/-/g, ' ');

    const { data, error } = await supabase
        .from('chabitacion')
        .select('*')
        .eq('idexperiencia', id)
        .eq('nombre', nombre)
        .single();


    if (error) {
        throw new Error(error.message);
    }

    return data;
}
