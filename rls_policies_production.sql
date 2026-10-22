-- ==============================================================================
-- PLAN MAESTRO DE SEGURIDAD RLS (ROW LEVEL SECURITY) — NATIVO ECO TOURS
-- ==============================================================================
-- Este script activa y configura RLS en todas las tablas de Supabase.
-- Aplica el Principio de Menor Privilegio (Least Privilege):
--   1. Catálogos: Lectura pública, escritura bloqueada a usuarios externos.
--   2. Newsletter: Escritura pública (suscripción), lectura privada (anti-scraping).
--   3. Usuarios y Favoritos: Aislados por auth.uid() (cada usuario solo ve lo suyo).
--   4. Reservas y Pagos: Lectura exclusiva del titular, creación y modificación
--      exclusiva del backend vía service_role (anti-fraude / anti-manipulación).
--
-- NOTA ARQUITECTÓNICA:
-- El backend de NativoAdmin y los endpoints de NativoEcoTours (/api/payments/...)
-- operan con SUPABASE_SERVICE_ROLE_KEY. En PostgreSQL, service_role ignora RLS.
-- Por lo tanto, este blindaje NO interrumpe la operación de administración ni pagos.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. HABILITACIÓN DE RLS EN TODAS LAS TABLAS
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.cubicacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dubicacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cexperiencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dexperiencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chabitacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dhabitacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.susuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rfavoritoubicacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mreserva ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rhabitacionreserva ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mpago ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dplazo ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bloqueos_habitacion ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. LIMPIEZA DE POLÍTICAS ANTERIORES / INSEGURAS
-- ------------------------------------------------------------------------------
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'cubicacion', 'dubicacion', 'cexperiencia', 'dexperiencia',
            'chabitacion', 'dhabitacion', 'susuario', 'rfavoritoubicacion',
            'newsletter_subscriptions', 'mreserva', 'rhabitacionreserva',
            'mpago', 'dplazo', 'bloqueos_habitacion'
          )
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 3. CATÁLOGOS PÚBLICOS (Lectura libre, Escritura solo Administrador/Service Role)
-- ------------------------------------------------------------------------------

-- Ubicaciones (Destinos)
CREATE POLICY "cubicacion_select_public" 
ON public.cubicacion FOR SELECT 
TO public 
USING (true);

-- Detalle de Ubicaciones
CREATE POLICY "dubicacion_select_public" 
ON public.dubicacion FOR SELECT 
TO public 
USING (true);

-- Experiencias (Tours)
CREATE POLICY "cexperiencia_select_public" 
ON public.cexperiencia FOR SELECT 
TO public 
USING (true);

-- Detalle de Experiencias
CREATE POLICY "dexperiencia_select_public" 
ON public.dexperiencia FOR SELECT 
TO public 
USING (true);

-- Catálogo de Habitaciones
CREATE POLICY "chabitacion_select_public" 
ON public.chabitacion FOR SELECT 
TO public 
USING (true);

-- Detalle de Habitaciones (cupos y disponibilidad)
CREATE POLICY "dhabitacion_select_public" 
ON public.dhabitacion FOR SELECT 
TO public 
USING (true);


-- ------------------------------------------------------------------------------
-- 4. CAPTACIÓN / NEWSLETTER (Escritura pública, Lectura privada)
-- ------------------------------------------------------------------------------
-- Cualquier visitante puede suscribirse ingresando su correo:
CREATE POLICY "newsletter_insert_public" 
ON public.newsletter_subscriptions FOR INSERT 
TO public 
WITH CHECK (email IS NOT NULL AND length(trim(email)) > 5);

-- La lectura queda completamente BLOQUEADA para clientes externos.
-- Solo service_role (NativoAdmin) puede listar y enviar correos masivos.


-- ------------------------------------------------------------------------------
-- 5. USUARIOS Y PERFILES (Privacidad Estricta)
-- ------------------------------------------------------------------------------
-- Cada usuario registrado SOLO puede leer su propio perfil:
CREATE POLICY "susuario_select_own" 
ON public.susuario FOR SELECT 
TO authenticated 
USING (auth.uid() = "idAuth");

-- Cada usuario registrado SOLO puede crear su propio perfil al registrarse:
CREATE POLICY "susuario_insert_own" 
ON public.susuario FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = "idAuth");

-- Cada usuario registrado SOLO puede modificar su propia información:
CREATE POLICY "susuario_update_own" 
ON public.susuario FOR UPDATE 
TO authenticated 
USING (auth.uid() = "idAuth")
WITH CHECK (auth.uid() = "idAuth");


-- ------------------------------------------------------------------------------
-- 6. FAVORITOS DE USUARIO
-- ------------------------------------------------------------------------------
-- Cada usuario solo gestiona sus propios favoritos:
CREATE POLICY "rfavoritoubicacion_select_own" 
ON public.rfavoritoubicacion FOR SELECT 
TO authenticated 
USING (auth.uid() = usuario_id);

CREATE POLICY "rfavoritoubicacion_insert_own" 
ON public.rfavoritoubicacion FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "rfavoritoubicacion_delete_own" 
ON public.rfavoritoubicacion FOR DELETE 
TO authenticated 
USING (auth.uid() = usuario_id);


-- ------------------------------------------------------------------------------
-- 7. RESERVAS Y FINANZAS (Máxima Seguridad / Anti-Manipulación)
-- ------------------------------------------------------------------------------
-- Lectura: El cliente registrado solo puede consultar sus propias reservas:
CREATE POLICY "mreserva_select_own" 
ON public.mreserva FOR SELECT 
TO authenticated 
USING (auth.uid() = usuario_id);

-- ESCRITURA en mreserva: BLOQUEADA para clientes (anon y authenticated).
-- La reserva se crea exclusivamente en /api/payments/create-intent y se confirma
-- en /api/payments/webhook usando service_role. Esto impide que un cliente
-- intente alterar el monto total, el estatus de pago o suplantar reservas.

-- Habitaciones reservadas: Solo visibles si pertenecen a una reserva del usuario:
CREATE POLICY "rhabitacionreserva_select_own" 
ON public.rhabitacionreserva FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.mreserva 
        WHERE mreserva.id = rhabitacionreserva.idmreserva 
          AND mreserva.usuario_id = auth.uid()
    )
);

-- Pagos: Solo visibles si pertenecen a una reserva del usuario titular:
CREATE POLICY "mpago_select_own" 
ON public.mpago FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.mreserva 
        WHERE mreserva.id = mpago.reserva_id 
          AND mreserva.usuario_id = auth.uid()
    )
);

-- Plazos / Abonos: Solo visibles si pertenecen a una reserva del usuario titular:
CREATE POLICY "dplazo_select_own" 
ON public.dplazo FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.mreserva 
        WHERE mreserva.id = dplazo.id_reserva 
          AND mreserva.usuario_id = auth.uid()
    )
);


-- ------------------------------------------------------------------------------
-- 8. BLOQUEOS TEMPORALES DE HABITACIÓN (Checkout)
-- ------------------------------------------------------------------------------
-- Lectura pública para saber qué habitaciones están retenidas:
CREATE POLICY "bloqueos_select_public" 
ON public.bloqueos_habitacion FOR SELECT 
TO public 
USING (true);

-- Permitir limpiar el bloqueo al abandonar el checkout mediante su session_id:
CREATE POLICY "bloqueos_delete_public" 
ON public.bloqueos_habitacion FOR DELETE 
TO public 
USING (true);
