import { supabase } from '../supabase/client';

/**
 * Obtiene la URL del video principal del hero desde configuracion_sitio.
 * Retorna null si no está configurado o si ocurre algún error.
 */
export async function getHeroVideoUrl() {
    try {
        const { data, error } = await supabase
            .from('configuracion_sitio')
            .select('valor')
            .eq('clave', 'hero_video_url')
            .maybeSingle();

        if (error) {
            console.error('Error al consultar hero_video_url:', error.message);
            return null;
        }

        return data?.valor && data.valor.trim() !== '' ? data.valor : null;
    } catch (err) {
        console.error('Error inesperado al obtener hero_video_url:', err);
        return null;
    }
}

/**
 * Obtiene si el Navbar debe mostrarse siempre en blanco
 */
export async function getNavbarSiempreBlanco() {
    try {
        const { data, error } = await supabase
            .from('configuracion_sitio')
            .select('valor')
            .eq('clave', 'navbar_siempre_blanco')
            .maybeSingle();

        if (error) {
            console.error('Error al consultar navbar_siempre_blanco:', error.message);
            return false;
        }

        return data?.valor === 'true';
    } catch (err) {
        console.error('Error inesperado al obtener navbar_siempre_blanco:', err);
        return false;
    }
}
