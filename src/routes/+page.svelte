<script>
    import ToursDestacados from '$lib/components/toursDestacados.svelte';
    import videoSrc from '$lib/assets/videos/22.mp4';
    import logoNativo from '$lib/assets/logos/logoNativoNegro.png';
    import home1 from '$lib/assets/backgrounds/home1.png';
    import home2 from '$lib/assets/backgrounds/home2.png';
    import VinayakBackground from '$lib/assets/backgrounds/vinayak-jayaram.jpg';
    import TarcilaBackground from '$lib/assets/backgrounds/tarcila.jpg';

    export let data;
    let ubicaciones = data.props.ubicaciones;
</script>

<!-- Sección Hero con Video -->
<section class="relative w-full h-screen overflow-hidden">
    <!-- Logo centrado -->
    <div class="absolute left-1/2 top-32 z-30 -translate-x-1/2 flex justify-center animate-fade-in">
        <img src={logoNativo} alt="Logo Nativo" class="h-12 w-auto drop-shadow-2xl" />
    </div>
    
    <!-- Video de fondo -->
    <video
        src={videoSrc}
        autoplay
        muted
        loop
        playsinline
        class="absolute inset-0 w-full h-full object-cover"
    ></video>
    
    <!-- Overlay oscuro sutil para mejor contraste -->
    <div class="absolute inset-0 bg-black/20 z-10"></div>
    
    <!-- Gradiente superior para integrar con navbar si existe -->
    <div class="absolute top-0 left-0 w-full h-32 z-20 pointer-events-none bg-gradient-to-b from-black/40 to-transparent"></div>
    
    <!-- Gradiente inferior más suave para transición -->
    <div class="absolute bottom-0 left-0 w-full h-96 z-20 pointer-events-none bg-gradient-to-t from-black via-black/70 to-transparent"></div>
    
    <!-- Texto hero opcional (puedes descomentar si lo necesitas) -->
    <!-- <div class="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 text-center px-4">
        <h1 class="text-white text-5xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
            Descubre Chihuahua
        </h1>
        <p class="text-white/90 text-xl md:text-2xl drop-shadow-lg">
            Experiencias únicas en la naturaleza
        </p>
    </div> -->
</section>

<!-- Contenido principal con background fluido -->
<div class="relative bg-black">
    <!-- Background image con overlay -->
    <div 
        class="absolute inset-0 z-0 opacity-40"
        style="background-image: url({TarcilaBackground}); background-size: cover; background-position: center;"
    ></div>
    
    <!-- Overlay de degradado para profundidad -->
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-black via-transparent to-black"></div>
    
    <!-- Contenido principal -->
    <div class="relative z-10">
        <!-- Tours destacados con padding -->
        <div class="pt-16 pb-12">
            <ToursDestacados {ubicaciones} todasLasExperiencias={true} />
        </div>

        <!-- Sección de contenido 1 -->
        <section class="py-16 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
            <div class="bg-black/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-white/10">
                <h2 class="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-8 leading-relaxed">
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">NATIVO ECOTOURS</span> somos creadores de experiencias únicas en los lugares más extraordinarios de Chihuahua
                </h2>
                <div class="relative overflow-hidden rounded-xl shadow-2xl group">
                    <img 
                        src={home1} 
                        alt="Experiencia 1" 
                        class="w-full h-auto transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            </div>
        </section>

        <!-- Sección de contenido 2 -->
        <section class="py-16 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
            <div class="bg-black/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-white/10">
                <h2 class="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-8 leading-relaxed">
                    Atrévete a conectar con la naturaleza y a desconectarte de la rutina cotidiana, conoce los paraísos que Chihuahua tiene para ofrecer y experimenta nuevas amistades.
                </h2>
                <div class="relative overflow-hidden rounded-xl shadow-2xl group mb-8">
                    <img 
                        src={home2} 
                        alt="Experiencia 2" 
                        class="w-full h-auto transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <!-- Botón CTA mejorado -->
                <div class="flex justify-center md:justify-start">
                    <a 
                        href="/cotizacion" 
                        class="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <span>Cotización personalizada</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>

        <!-- Espaciado final -->
        <div class="h-16"></div>
    </div>
</div>

<style>
    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    .animate-fade-in {
        animation: fade-in 1s ease-out;
    }
</style>