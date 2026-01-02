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

<!-- Diseño minimalista con paleta oscura -->
<div class="group relative w-[380px] min-w-[380px] h-[520px] snap-center flex-shrink-0 cursor-pointer">
    <!-- Card principal con colores oscuros -->
    <div class="relative w-full h-full bg-neutral-900/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500">
        
        <!-- Imagen principal mucho más grande -->
        <div class="relative h-[400px] overflow-hidden">
            <img 
                src={portada[0]} 
                alt={nombre_ubicacion} 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            <!-- Overlay sutil con gradiente -->
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent"></div>
            
            <!-- Indicador verde minimalista -->
            <div class="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full opacity-60 group-hover:opacity-100 group-hover:shadow-lg group-hover:shadow-green-400/50 transition-all duration-300"></div>
        </div>

        <!-- Contenido compacto con blur -->
        <div class="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm bg-neutral-900/30">
            <!-- Información principal -->
            <div class="mb-4 ">
                <h3 class="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-green-100 transition-colors duration-300">
                    {nombre_ubicacion}
                </h3>
                
                <!-- Ubicación con ícono verde -->
                <div class="flex items-center text-gray-400 group-hover:text-green-300 transition-colors duration-300">
                    <svg class="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span class="text-sm font-medium">{estado_ubicacion}</span>
                </div>
            </div>

            <!-- Botón minimalista con tema oscuro -->
            <div class="flex items-center justify-between backdrop-blur-sm">
                <!-- Línea decorativa verde -->
                <div class="flex-1 h-px bg-neutral-700 group-hover:bg-green-400 transition-colors duration-500"></div>
                
                <!-- Botón -->
                <a 
                    href="/ubicacion/{formatearNombreParaURL(nombre_ubicacion)}"
                    class="ml-4 group/btn flex items-center text-green-400 hover:text-green-300 font-medium text-sm transition-all duration-300"
                >
                    <span class="mr-2">Explorar</span>
                    <svg class="w-4 h-4 transform transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</div>
