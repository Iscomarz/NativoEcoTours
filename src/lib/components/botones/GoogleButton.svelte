<script>
    import { supabase } from '$lib/core/supabase/client.js';
    import logoGoogle from '$lib/assets/logos/logoGoogle.png';

    export let text = "Continuar con Google";

    async function loginWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) {
            console.error('Error al iniciar sesión con Google:', error.message);
        }
    }
</script>

<div class="flex flex-col items-center">
    <button
        on:click={loginWithGoogle}
        class="mt-4 flex w-full items-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
    >
        <!-- Contenedor para dividir logo y texto -->
        <div class="flex w-full items-center">
            <!-- Logo Google a la izquierda -->
            <div class="flex items-center justify-center px-4 py-3 border-r border-white/10">
                <img src={logoGoogle} alt="Google" class="h-4 w-4 opacity-70" />
            </div>
            <!-- Texto centrado verticalmente y ocupa el resto -->
            <div class="flex-1 flex items-center justify-center text-xs font-extralight tracking-[0.3em] uppercase text-white/50 py-3">
                {text}
            </div>
        </div>
    </button>
</div>