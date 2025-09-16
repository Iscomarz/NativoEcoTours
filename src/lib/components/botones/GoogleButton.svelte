<script>
    import logoGoogle from '$lib/assets/logos/logoGoogle.png';
</script>

<div class="flex flex-col items-center">
    <button
        on:click={loginWithGoogle}
        class="mt-4 flex w-full items-center rounded-md bg-blue-600 font-medium text-white transition hover:bg-blue-700"
    >
        <!-- Contenedor para dividir logo y texto -->
        <div class="flex w-full items-center">
            <!-- Logo Google a la izquierda -->
            <div class="flex items-center justify-center bg-white rounded-l-md px-4 py-3">
                <img src={logoGoogle} alt="Google" class="h-5 w-5" />
            </div>
            <!-- Texto centrado verticalmente y ocupa el resto -->
            <div class="flex-1 flex items-center justify-center text-base">
                Continuar con Google
            </div>
        </div>
    </button>
</div>