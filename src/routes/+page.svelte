<script>
    import ToursDestacados from '$lib/components/ToursDestacados.svelte';
    import videoSrc from '$lib/assets/videos/22.mp4';
    import logoNativo from '$lib/assets/logos/logoNativoNegro.png';
    import home1 from '$lib/assets/backgrounds/home1.png';
    import home2 from '$lib/assets/backgrounds/home2.png';
    import home3 from '$lib/assets/backgrounds/home3.png';
    import TarcilaBackground from '$lib/assets/backgrounds/tarcila.jpg';
    import campfire from '$lib/assets/icons/campfire-thin.svg';
    import ButtonCotizacion from '$lib/components/ButtonCotizacion.svelte';

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
    
    <!-- Overlay oscuro sutil -->
    <div class="absolute inset-0 bg-black/20 z-10"></div>
    
    <!-- Gradiente superior -->
    <div class="absolute top-0 left-0 w-full h-32 z-20 pointer-events-none bg-gradient-to-b from-black/40 to-transparent"></div>
    
    <!-- Gradiente inferior -->
    <div class="absolute bottom-0 left-0 w-full h-96 z-20 pointer-events-none bg-gradient-to-t from-black via-black/70 to-transparent"></div>

    <!-- Fragmento de copy sobre el video -->
    <div class="absolute bottom-36 z-30 text-center w-full px-6">
        <p class="text-white/60 text-xs tracking-[0.3em] uppercase mb-3">Chihuahua · México</p>
        <!-- <h1 class="text-white text-xl md:text-1xl font-extralight tracking-widest leading-relaxed">
            Creadores de experiencias únicas <br> en los lugares más extraordinarios del estado de #Chihuahua
        </h1> -->
    </div>
</section>

<!-- Contenido principal -->
<div class="relative bg-black">
    <!-- Background image con overlay -->
    <div 
        class="absolute inset-0 z-0 opacity-30"
        style="background-image: url({TarcilaBackground}); background-size: cover; background-position: center; background-attachment: fixed;"
    ></div>
    
    <!-- Overlay degradado -->
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-black via-transparent to-black"></div>
    
    <!-- Contenido -->
    <div class="relative z-10">

        <!-- ─── ACTO I: La presentación ─── -->
        <section class="pt-24 pb-12 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto text-center">
            <p class="text-green-400/70 text-xs tracking-[0.4em] uppercase mb-6">Creadores de experiencias</p>
            <!-- <h2 class="text-white text-lg md:text-xl font-extralight tracking-wide leading-relaxed mb-6">
                Somos <span class="text-white font-light">NATIVO ECOTOURS</span>, un equipo apasionado por mostrar los rincones más salvajes y hermosos del estado de Chihuahua.
            </h2> -->
            <p class="text-white/50 text-sm font-extralight tracking-wide leading-loose max-w-2xl mx-auto">
                Cada experiencia que diseñamos es una invitación a desconectarte del ruido del mundo y reconectarte con lo que importa: la tierra, la gente y el momento presente.
            </p>
        </section>

        <!-- Separador -->
        <div class="flex items-center max-w-5xl mx-auto px-6 md:px-12 lg:px-20 mb-16">
            <div class="flex-1 h-px bg-white/10"></div>
            <img src={campfire} alt="" class="h-5 w-5 mx-6 opacity-30" style="filter: invert(1);" />
            <div class="flex-1 h-px bg-white/10"></div>
        </div>

        <!-- ─── Pilares de valor ─── -->
        <section class="pb-20 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div class="flex flex-col items-center gap-3">
                    <span class="text-green-400/60 text-2xl font-thin">01</span>
                    <h3 class="text-white text-sm font-light tracking-widest uppercase">Naturaleza auténtica</h3>
                    <p class="text-white/40 text-xs font-extralight leading-relaxed tracking-wide">Destinos seleccionados por su belleza genuina, sin lo superficial del turismo masivo.</p>
                </div>
                <div class="flex flex-col items-center gap-3">
                    <span class="text-green-400/60 text-2xl font-thin">02</span>
                    <h3 class="text-white text-sm font-light tracking-widest uppercase">Experiencias a medida</h3>
                    <p class="text-white/40 text-xs font-extralight leading-relaxed tracking-wide">Cada tour se adapta al grupo, al ritmo y al espíritu aventurero de quien lo vive.</p>
                </div>
                <div class="flex flex-col items-center gap-3">
                    <span class="text-green-400/60 text-2xl font-thin">03</span>
                    <h3 class="text-white text-sm font-light tracking-widest uppercase">Comunidad y pertenencia</h3>
                    <p class="text-white/40 text-xs font-extralight leading-relaxed tracking-wide">Saldrás con nuevos amigos. El viaje transforma, pero la comunidad permanece.</p>
                </div>
            </div>
        </section>

        <!-- ─── ACTO II: La promesa visual ─── -->
        <section class="mb-1">
            <div class="relative overflow-hidden group">
                <img 
                    src={home1} 
                    alt="Experiencia Nativo" 
                    class="w-full h-[55vh] object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>
                <div class="absolute inset-0 flex flex-col justify-end p-10 md:p-16">
                    <p class="text-white/50 text-xs tracking-[0.35em] uppercase mb-3">La sierra te espera</p>
                    <h2 class="text-white text-xl md:text-2xl font-extralight tracking-wide max-w-md leading-relaxed">
                        Paisajes que no caben en ninguna pantalla. Hay que estar ahí.
                    </h2>
                </div>
            </div>
        </section>

        <!-- Segunda imagen (grid 3+2) -->
        <section class="mb-1 grid grid-cols-1 md:grid-cols-5">
            <div class="relative overflow-hidden group md:col-span-3">
                <img 
                    src={home2} 
                    alt="Naturaleza Chihuahua"
                    class="w-full h-[45vh] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div class="relative overflow-hidden group md:col-span-2">
                <img 
                    src={home3} 
                    alt="Aventura Nativo"
                    class="w-full h-[45vh] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute inset-0 flex flex-col justify-end p-8">
                    <p class="text-white/50 text-xs tracking-[0.3em] uppercase mb-2">Cada detalle importa</p>
                    <p class="text-white text-sm font-extralight leading-relaxed tracking-wide">
                        Desde el primer mensaje hasta el último abrazo del grupo.
                    </p>
                </div>
            </div>
        </section>

        <!-- Tours destacados -->
        <div class="pt-20 pb-12">
            <p class="text-white/40 text-xs tracking-[0.4em] uppercase text-center mb-10">Próximas experiencias</p>
            <ToursDestacados {ubicaciones} todasLasExperiencias={true} />
        </div>

        <!-- ─── ACTO III: El llamado ─── -->
        <section class="py-24 px-6 text-center max-w-2xl mx-auto">
            <p class="text-green-400/60 text-xs tracking-[0.4em] uppercase mb-6">Empieza tu aventura</p>
            <h2 class="text-white text-lg md:text-xl font-extralight tracking-wide leading-relaxed mb-4">
                No esperes el momento perfecto.<br/>
                <span class="text-white/50">El momento perfecto es ahora.</span>
            </h2>
            <p class="text-white/30 text-xs font-extralight tracking-wider leading-loose mb-12">
                Cuéntanos qué tipo de experiencia buscas y nosotros diseñamos el resto.
            </p>
            <div class="flex justify-center">
                <ButtonCotizacion />
            </div>
        </section>

        <!-- Redes sociales -->
        <div class="pb-16 flex justify-center gap-8">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="/src/lib/assets/logos/logoInsta.png" alt="Instagram" class="h-4 w-4 opacity-25 hover:opacity-70 transition-opacity" style="filter: invert(1);" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="/src/lib/assets/logos/logoFace.png" alt="Facebook" class="h-4 w-4 opacity-25 hover:opacity-70 transition-opacity" style="filter: invert(1);" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <img src="/src/lib/assets/logos/logoYouTube.png" alt="YouTube" class="h-4 w-4 opacity-25 hover:opacity-70 transition-opacity" style="filter: invert(1);" />
            </a>
        </div>

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

    @keyframes fade-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fade-in {
        animation: fade-in 1s ease-out;
    }
</style>