<script>
    import ToursDestacados from '$lib/components/toursDestacados.svelte';
    import videoSrc from '$lib/assets/videos/22.mp4';
    import logoNativo from '$lib/assets/logos/logoNativoNegro.png';
</script>

<!-- Contenedor relativo para video y gradiente -->
<div class="relative w-full h-screen">
    <!-- Logo centrado en X y arriba en Y, pero en el flujo normal -->
    <div class="absolute left-1/2 top-32 z-50 -translate-x-1/2 flex justify-center">
        <img src={logoNativo} alt="Logo Nativo" class="h-12 w-auto" />
    </div>
    <!-- Video de fondo -->
    <video
        src={videoSrc}
        autoplay
        muted
        loop
        class="w-full h-full object-cover z-0"
    ></video>
    <!-- Gradiente negro en la parte inferior del video -->
    <div class="absolute bottom-0 left-0 w-full h-60 z-10 pointer-events-none bg-gradient-to-t from-black via-black/80 to-transparent"></div>
</div>

<!-- Contenido principal debajo del video -->
<div class="relative z-20 flex flex-col">
    <ToursDestacados />
</div>