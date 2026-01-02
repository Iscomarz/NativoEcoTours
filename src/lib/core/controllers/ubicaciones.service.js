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
    //.limit(4);
    //.in('id_ubicacion', [1,2,8]);

    if(error){
        throw new Error (error.message);
    }

    return data;
}

export async function getUbicacionById(id){
    const {data, error} = await supabase.
    from('cubicacion')
    .select('*')
    .eq('id_ubicacion', id)
    .single();

    if(error){
        throw new Error (error.message);
    }

    return data;
}

export async function getUbicacionByNombre(nombre){
    const nombreUbicacion = nombre.replace(/-/g, ' ');
    console.log("Buscando ubicación por nombre:", nombreUbicacion);
    const {data, error} = await supabase.
    from('cubicacion')
    .select('*')
    .eq('nombre_ubicacion', nombreUbicacion)
    .single();
    console.log("Resultado de la búsqueda:", data);

    if(error){
        throw new Error (error.message);
    }

    return data;
}

export async function getDetalleUbicacion(id){
    const {data, error} = await supabase.
    from('dubicacion')
    .select('*')
    .eq('id_ubicacion', id)
    .single();  
    if(error){
        throw new Error (error.message);
    }
    return data;
}