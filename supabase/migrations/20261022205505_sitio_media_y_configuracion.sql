-- Migration: sitio_media_y_configuracion
-- Description: Creates configuracion_sitio table and sitio-media storage bucket with RLS policies

-- 1. Table for site configuration
CREATE TABLE IF NOT EXISTS public.configuracion_sitio (
    clave text PRIMARY KEY,
    valor text NOT NULL,
    descripcion text,
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.configuracion_sitio ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "configuracion_sitio_select_public" ON public.configuracion_sitio;
DROP POLICY IF EXISTS "configuracion_sitio_all_authenticated" ON public.configuracion_sitio;

-- Public can read site configuration
CREATE POLICY "configuracion_sitio_select_public"
ON public.configuracion_sitio FOR SELECT
TO public
USING (true);

-- Authenticated users (admin) can manage site configuration
CREATE POLICY "configuracion_sitio_all_authenticated"
ON public.configuracion_sitio FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Initial seed for hero_video_url if not exists
INSERT INTO public.configuracion_sitio (clave, valor, descripcion)
VALUES ('hero_video_url', '', 'URL del video principal del hero en la página de inicio')
ON CONFLICT (clave) DO NOTHING;

-- 2. Storage Bucket setup
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'sitio-media',
    'sitio-media',
    true,
    10485760, -- 10MB limit
    ARRAY['video/mp4', 'video/webm', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public read access for sitio-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage sitio-media" ON storage.objects;

-- Anyone can view files in sitio-media
CREATE POLICY "Public read access for sitio-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'sitio-media');

-- Authenticated users can insert/update/delete in sitio-media
CREATE POLICY "Authenticated users can manage sitio-media"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'sitio-media')
WITH CHECK (bucket_id = 'sitio-media');
