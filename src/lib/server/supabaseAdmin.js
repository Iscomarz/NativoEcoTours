import { createClient } from '@supabase/supabase-js';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let supabaseAdminInstance = null;

/**
 * Retorna un cliente de Supabase con privilegios administrativos (service_role).
 * SOLO debe ser utilizado en endpoints de servidor (Webhooks, cron jobs, background tasks).
 */
export function getSupabaseAdmin() {
	if (!supabaseAdminInstance) {
		const url = publicEnv.PUBLIC_SUPABASE_URL;
		const serviceKey = privateEnv.SUPABASE_SERVICE_ROLE_KEY;

		if (!url || !serviceKey) {
			console.error('❌ Error: PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configuradas.');
			throw new Error('Supabase admin credentials are missing');
		}

		supabaseAdminInstance = createClient(url, serviceKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		});
	}
	return supabaseAdminInstance;
}
