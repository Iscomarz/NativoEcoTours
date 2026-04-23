<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/core/supabase/client';
    import { env } from '$env/dynamic/public';
    import { browser } from '$app/environment';

    export let session = null;

    async function handleCredentialResponse(response) {
        try {
            const { error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
            });
            if (error) throw error;
            window.location.reload();
        } catch (error) {
            // Mantener solo errores críticos
            console.error('Error Google One Tap:', error.message);
        }
    }

    onMount(() => {
        if (!browser || session) return;

        const clientID = env.PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientID) return;

        if (window._oneTapLoaded) return;
        window._oneTapLoaded = true;

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: clientID,
                    callback: handleCredentialResponse,
                    itp_support: true,
                    use_fedcm_for_prompt: true 
                });

                window.google.accounts.id.prompt();
            }
        };
        document.head.appendChild(script);
    });
</script>
