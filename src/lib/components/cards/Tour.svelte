<script>
    export let titulo;
    export let subtitulo;
    export let fecha;
    export let boton;
    export let banner;
    export let img;
</script>

<div class="relative w-[280px] min-w-[280px] snap-center bg-black rounded-xl overflow-hidden shadow-lg flex-shrink-0">
    <!-- Imagen -->
    <img src={img} alt={titulo} class="w-full h-[380px] object-cover" />

    <!-- Banner rojo opcional -->
    {#if banner}
        <div class="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
            {banner}
        </div>
    {/if}

    <!-- Contenido -->
    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-4">
        <h3 class="text-2xl font-bold drop-shadow-lg">{titulo}</h3>
        <p class="text-sm text-gray-200">{subtitulo}</p>
        <p class="text-xs text-gray-300 mb-3">{fecha}</p>

        <button
            class="bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-4 py-2 rounded-md uppercase shadow-md w-fit"
        >
            {boton}
        </button>
    </div>
</div>
