import { supabase } from '$lib/core/supabase/client.js';
import { redirect, fail } from '@sveltejs/kit';

export const load = async () => {
    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (session) {
        throw redirect(303, '/');
    }
};