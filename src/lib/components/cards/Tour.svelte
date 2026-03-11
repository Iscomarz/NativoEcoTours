<script>
    import { onMount } from 'svelte';

    export let nombre_ubicacion;
    export let estado_ubicacion;
    export let pais_ubicacion;
    export let portada;
    
    // Función para formatear el nombre para la URL
    function formatearNombreParaURL(nombre) {
        return nombre
            .replace(/\s+/g, '-')        // Reemplazar espacios con guiones
            .replace(/[áàäâ]/g, 'a')     // Normalizar caracteres
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[òöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n'); // Eliminar caracteres especiales
    }
</script>

<!-- Card minimalista -->
<div class="group relative w-[380px] min-w-[380px] h-[520px] snap-center flex-shrink-0 cursor-pointer">
<div class="relative w-full h-full bg-white/[0.03] border border-white/10 overflow-hidden transition-colors duration-500 hover:bg-white/[0.05]">
        
        <!-- Enlace que cubre toda la card -->
        <a 
            href="/ubicacion/{formatearNombreParaURL(nombre_ubicacion)}"
            class="absolute inset-0 z-10"
            aria-label="Ver {nombre_ubicacion}"
        ></a>
        
        <!-- Imagen -->
        <div class="relative h-[400px] overflow-hidden">
            <img 
                src={portada[0]} 
                alt={nombre_ubicacion} 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <!-- Overlay sutil -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

            <!-- Indicador minimalista -->
            <div class="absolute top-4 right-4 w-1.5 h-1.5 bg-white/40 group-hover:bg-white/70 transition-colors duration-300"></div>
        </div>

        <!-- Contenido inferior -->
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-black/20">
            <div class="mb-4">
                <h3 class="text-sm font-light text-white/80 mb-1.5 leading-tight tracking-widest group-hover:text-white transition-colors duration-300">
                    {nombre_ubicacion}
                </h3>
                
                <div class="flex items-center gap-1.5 text-white/30 group-hover:text-white/50 transition-colors duration-300">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span class="text-xs font-extralight tracking-[0.3em] uppercase">{estado_ubicacion}</span>
                </div>
            </div>

            <div class="flex items-center justify-between">
                <!-- Línea decorativa -->
                <div class="flex-1 h-px bg-white/10 group-hover:bg-green-400 transition-colors duration-500"></div>
                
                <!-- Texto decorativo Explorar -->
                <span 
                    aria-hidden="true"
                    class="ml-4 flex items-center text-white/30 group-hover:text-white/70 font-extralight text-xs tracking-[0.3em] uppercase transition-all duration-300"
                >
                    <span class="mr-2">Explorar</span>
                    <svg class="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </span>
            </div>
        </div>
    </div>
</div>
