import { supabase } from '../supabase/client';

export async function getUbicaciones(){
    const {data, error} = await supabase.
    from('cubicacion')
    .select('*')
    .eq('activo', true);

    if(error){
        throw new Error (error.message);
    }

    return data;
}

export async function getUbicacionesDestacadas(){
    const {data, error} = await supabase.
    from('cubicacion')
    .select('*')
    .eq('activo', true);
    //.in('id_ubicacion', [1,2,8]);

    if(error){
        throw new Error (error.message);
    }

    return data;
}