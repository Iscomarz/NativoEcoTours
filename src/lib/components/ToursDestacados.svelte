<script>
    import { onMount } from 'svelte';
    import Tour from './cards/Tour.svelte';
    
    export let ubicaciones = [];
    export let todasLasExperiencias = false;
    
    let carouselContainer;
    let currentIndex = 0;
    let showNavigationButtons = false;
    let isDesktop = false;
    let isTransitioning = false;
    
    // Calcular cuántas cards se ven por pantalla
    let itemsPerView = 1;
    
    // Duplicar las cards para efecto infinito
    $: extendedUbicaciones = ubicaciones.length > 0 
        ? [...ubicaciones, ...ubicaciones] 
        : [];
    
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
                
                // Mostrar botones solo si hay tours
                showNavigationButtons = ubicaciones.length > 0;
            } else {
                // En móvil siempre slide
                itemsPerView = 1;
                showNavigationButtons = false;
            }
        }
    }
    
    function slideNext() {
        if (isTransitioning || ubicaciones.length === 0) return;
        
        isTransitioning = true;
        currentIndex += 1;
        
        // Si llegamos al final del primer conjunto, preparar el salto
        if (currentIndex >= ubicaciones.length) {
            updateCarouselPosition(true);
            
            setTimeout(() => {
                carouselContainer.style.transition = 'none';
                currentIndex = 0;
                updateCarouselPosition(false);
                
                // Pequeño delay para reactivar la transición
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        carouselContainer.style.transition = 'transform 500ms ease-in-out';
                        isTransitioning = false;
                    });
                });
            }, 500);
        } else {
            updateCarouselPosition(true);
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }
    }
    
    function slidePrev() {
        if (isTransitioning || ubicaciones.length === 0) return;
        
        isTransitioning = true;
        
        // Si estamos al inicio, saltar al final del primer conjunto primero
        if (currentIndex === 0) {
            carouselContainer.style.transition = 'none';
            currentIndex = ubicaciones.length;
            updateCarouselPosition(false);
            
            // Esperar un frame y luego hacer la animación hacia atrás
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    carouselContainer.style.transition = 'transform 500ms ease-in-out';
                    currentIndex -= 1;
                    updateCarouselPosition(true);
                    
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 500);
                });
            });
        } else {
            currentIndex -= 1;
            updateCarouselPosition(true);
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }
    }
    
    function updateCarouselPosition(withTransition = true) {
        if (carouselContainer && isDesktop) {
            const cardWidth = 380; // Ancho de cada card
            const gap = 40; // Gap entre cards (gap-10 = 40px)
            const scrollAmount = cardWidth + gap; // Una card completa por cada avance
            const translateX = currentIndex * scrollAmount;
            
            // Controlar la transición
            if (!withTransition) {
                carouselContainer.style.transition = 'none';
            } else {
                carouselContainer.style.transition = 'transform 500ms ease-in-out';
            }
            
            carouselContainer.style.transform = `translateX(-${translateX}px)`;
        }
    }
    
    // Reactive statement para actualizar cuando cambien las ubicaciones
    $: if (ubicaciones.length && typeof window !== 'undefined') {
        checkScreenSize();
    }
</script>

<section class="tours-destacados py-10  text-white">
    <h2 class="text-center text-3xl font-bold mb-8 tracking-wide uppercase">Destinos destacados</h2>

    <!-- Container del carrusel -->
    <div class="relative px-6">
        <!-- Botón anterior (solo escritorio) -->
        {#if showNavigationButtons}
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
        {#if showNavigationButtons}
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
                class="flex gap-10 {isDesktop ? '' : 'overflow-x-auto snap-x snap-mandatory px-6'}"
                style={isDesktop ? '' : 'padding-left: calc((100vw - 380px) / 2); padding-right: calc((100vw - 380px) / 2);'}
            >
                {#each extendedUbicaciones as tour, index}
                    <div class="flex-shrink-0 {isDesktop ? '' : 'snap-center'}">
                        <Tour {...tour} />
                    </div>
                {/each}
            </div>
        </div>
    </div>

    {#if todasLasExperiencias}
        <div class="text-center mt-8">
            <a href="/experiencias" class="text-green-500 font-bold uppercase tracking-wide hover:underline hover:text-green-400 transition-colors duration-300">
                Ver todas las experiencias
            </a>
        </div>
    {/if}
</section>