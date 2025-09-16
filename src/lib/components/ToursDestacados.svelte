<script>
    import Tour from './cards/Tour.svelte';
    import sampleTour1 from '$lib/assets/tours/sampleTour1.png';
    import sampleTour2 from '$lib/assets/tours/sampleTour2.png';
    import sampleTour3 from '$lib/assets/tours/sampleTour3.png';

    // Por ahora hardcodeado
    const tours = [
        {
            id: 1,
            titulo: "Día de Muertos",
            subtitulo: "Úrique, Chihuahua, México",
            fecha: "Del 1 al 3 de Noviembre del 2024",
            boton: "RESERVAR",
            banner: "INSCRIPCIONES ABIERTAS",
            img: sampleTour1
        },
        {
            id: 2,
            titulo: "Reinicio - Cuevas Anayawari",
            subtitulo: "Tónachi, Chihuahua, México",
            fecha: "25 | 26 Enero 2025",
            boton: "VER MÁS",
            img: sampleTour2
        },
        {
            id: 3,
            titulo: "Tour Latidos",
            subtitulo: "Tren Chepe | Ruta RZR | Barrancas del Cobre",
            fecha: "15 al 16 Febrero 2025",
            boton: "VER MÁS",
            img: sampleTour3
        }
    ];
</script>

<section class="tours-destacados py-10 bg-black text-white">
    <h2 class="text-center text-3xl font-bold mb-8 tracking-wide uppercase">Tours Destacados</h2>

    <!-- slider scroll-x -->
    <div class="flex gap-6 overflow-x-auto px-6 snap-x snap-mandatory" style="display: flex; justify-content: center;">
        {#each tours as tour}
            <Tour {...tour} />
        {/each}
    </div>

    <div class="text-center mt-6">
        <a href="/experiencias" class="text-green-500 font-bold uppercase tracking-wide hover:underline">
            Ver todas las experiencias
        </a>
    </div>
</section>
