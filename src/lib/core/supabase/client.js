import { createBrowserClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

// Usamos dynamic public para evitar errores de build si las variables no están presentes
export const supabase = createBrowserClient(
    env.PUBLIC_SUPABASE_URL || '',
    env.PUBLIC_SUPABASE_ANON_KEY || ''
);