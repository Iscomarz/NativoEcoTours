<script>
    import { onMount } from 'svelte';
    import Tour from './cards/Tour.svelte';
    
    export let ubicaciones = [];
    export let todasLasExperiencias = false;
    
    let carouselContainer;
    let currentIndex = 0;
    let showNavigationButtons = false;
    let isDesktop = false;
    
    // Calcular cuántas cards se ven por pantalla
    let itemsPerView = 1;
    
    onMount(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    });
    
    function checkScreenSize() {
        if (typeof window !== 'undefined') {
            isDesktop = window.innerWidth >= 1024; // lg breakpoint
            
            if (isDesktop) {
                // En escritorio: calcular cuántas cards caben
                if (window.innerWidth >= 1536) itemsPerView = 3; // 2xl
                else if (window.innerWidth >= 1280) itemsPerView = 3; // xl  
                else if (window.innerWidth >= 1024) itemsPerView = 2; // lg
                
                // Mostrar botones solo si hay más tours que los que caben
                showNavigationButtons = ubicaciones.length > itemsPerView;
            } else {
                // En móvil siempre slide
                itemsPerView = 1;
                showNavigationButtons = false;
            }
        }
    }
    
    function slideNext() {
        const maxIndex = Math.max(0, ubicaciones.length - itemsPerView);
        if (currentIndex < maxIndex) {
            currentIndex += 1;
            updateCarouselPosition();
        }
    }
    
    function slidePrev() {
        if (currentIndex > 0) {
            currentIndex -= 1;
            updateCarouselPosition();
        }
    }
    
    function updateCarouselPosition() {
        if (carouselContainer && isDesktop) {
            const cardWidth = 380; // Ancho de cada card
            const gap = 40; // Gap entre cards (gap-10 = 40px)
            // Desplazamiento más suave: avanza menos distancia (75% del ancho + gap)
            const scrollAmount = (cardWidth * 0.75) + gap; // ~325px por cada click
            const translateX = currentIndex * scrollAmount;
            carouselContainer.style.transform = `translateX(-${translateX}px)`;
        }
    }
    
    // Reactive statement para actualizar cuando cambien las ubicaciones
    $: if (ubicaciones.length && typeof window !== 'undefined') {
        checkScreenSize();
    }
</script>

<section class="tours-destacados py-10 bg-black text-white">
    <h2 class="text-center text-3xl font-bold mb-8 tracking-wide uppercase">Tours Destacados</h2>

    <!-- Container del carrusel -->
    <div class="relative px-6">
        <!-- Botón anterior (solo escritorio) -->
        {#if showNavigationButtons && currentIndex > 0}
            <button 
                on:click={slidePrev}
                class="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm border border-green-400 rounded-full flex items-center justify-center text-green-400 hover:bg-black/70 hover:border-green-300 hover:text-green-300 transition-all duration-300 hover:scale-105"
            >
                <svg class="w-6 h-6 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </button>
        {/if}

        <!-- Botón siguiente (solo escritorio) -->
        {#if showNavigationButtons && currentIndex < ubicaciones.length - itemsPerView}
            <button 
                on:click={slideNext}
                class="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm border border-green-400 rounded-full flex items-center justify-center text-green-400 hover:bg-black/70 hover:border-green-300 hover:text-green-300 transition-all duration-300 hover:scale-105"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </button>
        {/if}

        <!-- Contenedor de las cards -->
        <div class="overflow-hidden">
            <div 
                bind:this={carouselContainer}
                class="flex gap-10 transition-transform duration-500 ease-in-out {isDesktop ? '' : 'overflow-x-auto snap-x snap-mandatory px-6'}"
                style={isDesktop ? '' : 'padding-left: calc((100vw - 380px) / 2); padding-right: calc((100vw - 380px) / 2);'}
            >
                {#each ubicaciones as tour}
                    <div class="flex-shrink-0 {isDesktop ? '' : 'snap-center'}">
                        <Tour {...tour} />
                    </div>
                {/each}
            </div>
        </div>

        <!-- Indicadores de posición (solo escritorio con navegación) -->
        {#if showNavigationButtons}
            <div class="flex justify-center mt-6 space-x-2">
                {#each Array(Math.ceil(ubicaciones.length / itemsPerView)) as _, index}
                    <button
                        on:click={() => { currentIndex = index * itemsPerView; updateCarouselPosition(); }}
                        class="w-2 h-2 rounded-full transition-all duration-300 {currentIndex === index * itemsPerView ? 'bg-green-400' : 'bg-gray-600 hover:bg-gray-500'}"
                    ></button>
                {/each}
            </div>
        {/if}
    </div>

    {#if todasLasExperiencias}
        <div class="text-center mt-8">
            <a href="/experiencias" class="text-green-500 font-bold uppercase tracking-wide hover:underline hover:text-green-400 transition-colors duration-300">
                Ver todas las experiencias
            </a>
        </div>
    {/if}
</section>