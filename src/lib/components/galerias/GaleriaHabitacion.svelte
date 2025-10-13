<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  // Props
  /** @type {string[]} URLs de las imágenes */
  export let imagenes = [];
  /** @type {string} Título opcional para la galería */
  export let titulo = "Galería de imágenes";
  
  // Estado local
  let modalAbierto = false;
  let imagenActiva = 0;
  let cargando = true;
  
  // Limitar imágenes visibles a un máximo de 6
  $: visibleImages = imagenes.slice(0, 6);
  $: hiddenImagesCount = Math.max(0, imagenes.length - 6);
  
  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', manejarTeclas);
      return () => {
        window.removeEventListener('keydown', manejarTeclas);
        document.body.style.overflow = 'auto';
      };
    }
  });
  
  // Funciones para el modal
  function abrirModal(index) {
    imagenActiva = index;
    modalAbierto = true;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }
  
  function verTodasLasImagenes() {
    abrirModal(0);
  }
  
  function cerrarModal() {
    modalAbierto = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }
  
  function siguienteImagen() {
    cargando = true;
    imagenActiva = (imagenActiva + 1) % imagenes.length;
  }
  
  function anteriorImagen() {
    cargando = true;
    imagenActiva = (imagenActiva - 1 + imagenes.length) % imagenes.length;
  }
  
  function manejarTeclas(e) {
    if (!modalAbierto) return;
    
    if (e.key === 'Escape') {
      cerrarModal();
    } else if (e.key === 'ArrowRight') {
      siguienteImagen();
    } else if (e.key === 'ArrowLeft') {
      anteriorImagen();
    }
  }
  
  // Función para generar tamaños variados (simplificada)
  function getTamanio(index) {
    const patterns = [
      'col-span-2 row-span-2', // Grande
      'col-span-2 row-span-1', // Ancho
      'col-span-1 row-span-1', // Normal
      'col-span-1 row-span-2', // Alto
      'col-span-1 row-span-1', // Normal
      'col-span-1 row-span-1'  // Normal
    ];
    return patterns[index % patterns.length];
  }
</script>

<div class="w-full bg-[#181818] mt-14">
  <div class="mb-4 flex items-center justify-between">
    {#if titulo}
      <h2 class="text-xl font-bold tracking-wide text-white/90">{titulo}</h2>
    {/if}
    
    {#if hiddenImagesCount > 0}
      <button
        on:click={verTodasLasImagenes}
        class="rounded bg-neutral-700 px-3 py-1 text-sm text-white hover:bg-neutral-600 transition-colors"
      >
        Ver todas ({imagenes.length})
      </button>
    {/if}
  </div>
  
  <!-- Grid de tipo "masonry" con layout fijo -->
  <div 
    class="grid grid-cols-4 auto-rows-[120px] gap-3 overflow-hidden"
    style="max-height: min(600px, 60vh);"
  >
    {#each visibleImages as imagen, i}
      <div 
        class="relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/30 {getTamanio(i)}"
        on:click={() => abrirModal(i)}
        on:keydown={(e) => e.key === 'Enter' && abrirModal(i)}
        tabindex="0"
        role="button"
        aria-label={`Ver imagen ${i + 1} de ${imagenes.length}`}
      >
        <img
          src={imagen}
          alt={`Imagen ${i + 1}`}
          class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 hover:opacity-100">
          <div class="rounded-full bg-black/50 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    {/each}
    
    {#if hiddenImagesCount > 0}
      <div
        class="col-span-1 row-span-1 flex items-center justify-center rounded-lg bg-neutral-700/50 text-white hover:bg-neutral-700 transition-colors cursor-pointer"
        on:click={verTodasLasImagenes}
        on:keydown={(e) => e.key === 'Enter' && verTodasLasImagenes()}
        tabindex="0"
        role="button"
      >
        <span class="font-medium">+{hiddenImagesCount}</span>
      </div>
    {/if}
  </div>
  
  <!-- Modal para vista ampliada -->
  {#if modalAbierto}
    <div
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 p-4"
      transition:fade={{ duration: 200 }}
      on:click={cerrarModal}
      role="dialog"
      aria-modal="true"
    >
      <!-- Contenedor de imagen con controles -->
      <div 
        class="relative max-h-[90vh] max-w-[90vw] overflow-hidden"
        on:click|stopPropagation={() => {}}
      >
        <!-- Imagen actual -->
        <img
          src={imagenes[imagenActiva]}
          alt={`Imagen ${imagenActiva + 1} de ${imagenes.length}`}
          class="max-h-[85vh] max-w-[85vw] rounded object-contain"
          on:load={() => cargando = false}
        />
        
        <!-- Contador de imágenes -->
        <div 
          class="absolute top-4 right-4 rounded bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm"
          transition:fade
        >
          {imagenActiva + 1} / {imagenes.length}
        </div>
        
        <!-- Botones de navegación -->
        <button
          class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70"
          on:click|stopPropagation={anteriorImagen}
          aria-label="Imagen anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/70"
          on:click|stopPropagation={siguienteImagen}
          aria-label="Imagen siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <!-- Botón cerrar -->
        <button
          class="absolute top-4 left-4 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
          on:click|stopPropagation={cerrarModal}
          aria-label="Cerrar galería"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Indicador de carga -->
        {#if cargando}
          <div class="absolute inset-0 flex items-center justify-center bg-black/30">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>