<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import GaleriaMasonry from '$lib/components/GaleriaMasonry.svelte';
    import logoNativo from '$lib/assets/logos/logoNativo.png';

	let ubicacion = {};
	let detalle = {};
	let ubicaciones = [];
	export let data;

	$: ubicacion = data.ubicacion;
	$: detalle = data.detalle;
	$: ubicaciones = data.ubicaciones || [];

	// Calcular destino anterior y siguiente
	function formatearNombreParaURL(nombre) {
		return nombre
			.replace(/\s+/g, '-')
			.replace(/[áàäâ]/g, 'a')
			.replace(/[éèëê]/g, 'e')
			.replace(/[íìïî]/g, 'i')
			.replace(/[úùüû]/g, 'u')
			.replace(/ñ/g, 'n');
	}

	$: indiceActual = ubicaciones.findIndex(
		(u) => u.nombre_ubicacion === ubicacion.nombre_ubicacion
	);
	$: destAnterior = indiceActual > 0 ? ubicaciones[indiceActual - 1] : null;
	$: destSiguiente = indiceActual < ubicaciones.length - 1 ? ubicaciones[indiceActual + 1] : null;

	function irAnterior() {
		if (destAnterior) goto(`/ubicacion/${formatearNombreParaURL(destAnterior.nombre_ubicacion)}`);
	}

	function irSiguiente() {
		if (destSiguiente) goto(`/ubicacion/${formatearNombreParaURL(destSiguiente.nombre_ubicacion)}`);
	}

	// Navegación con teclado (solo destinos, el lightbox lo maneja GaleriaMasonry)
	function manejarTecla(event) {
		if (event.key === 'ArrowLeft') irAnterior();
		if (event.key === 'ArrowRight') irSiguiente();
	}

	onMount(() => {
		console.log('Página de ubicación montada');
	});
</script>

<svelte:window on:keydown={manejarTecla} />

<!-- Página de ubicación con diseño minimalista oscuro -->
<div class="min-h-screen bg-black text-white" transition:fade={{ duration: 400 }}>
	<!-- Hero Section con imagen de portada -->
	<div class="relative h-[60vh] overflow-hidden md:h-[70vh]">
		{#if ubicacion.portada && ubicacion.portada[0]}
			<img
				src={ubicacion.portada[0]}
				alt={ubicacion.nombre_ubicacion}
				class="h-full w-full object-cover"
			/>
		{/if}

		<!-- Overlay con gradiente -->
		<div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

		<!-- Indicador minimalista -->
		<div
			class="absolute top-8 right-8 h-1.5 w-1.5 bg-white/40"
		></div>

		<!-- Contenido del hero -->
		<div class="absolute right-0 bottom-0 left-0 px-6 pb-12 md:px-12 md:pb-16 lg:px-24">
			<div class="mx-auto max-w-6xl">
				<!-- Ubicación con ícono -->
				<div class="animate-fade-in mb-4 flex items-center text-white/40">
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					<span class="text-xs font-extralight tracking-[0.35em] uppercase"
						>{ubicacion.estado_ubicacion}, {ubicacion.pais_ubicacion}</span
					>
				</div>

				<!-- Nombre de la ubicación y logo con space-between -->
				<div class="flex items-end justify-between gap-4 mb-4">
					<h1 class="text-3xl leading-tight font-extralight tracking-widest md:text-5xl lg:text-6xl">
						{ubicacion.nombre_ubicacion}
					</h1>
					<img 
						src={logoNativo} 
						alt="Nativo Eco Tours" 
						class="h-16 w-auto md:h-20 lg:h-18 opacity-90 hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
					/>
				</div>

				<!-- Línea decorativa delgada -->
				<div class="h-px w-24 bg-white/20"></div>
			</div>
		</div>
	</div>

	<!-- Contenido principal -->
	<div class="px-6 py-16 md:px-12 md:py-20 lg:px-24">
		<div class="mx-auto max-w-6xl">
			<!-- Descripción con línea verde a la izquierda -->
			{#if detalle.descripcion_larga}
				<section class="mb-16 md:mb-20">
					<div class="flex gap-6">
						<!-- Línea verde vertical -->
						<div class="w-1 flex-shrink-0 bg-green-400"></div>

						<!-- Contenido -->
						<div class="flex-1">
							<p class="mb-8 text-sm leading-loose font-extralight tracking-wide whitespace-pre-line text-white/60 md:text-base">
								{detalle.descripcion_larga}
							</p>
						</div>
					</div>
				</section>
			{/if}

			<!-- Imagen destacada debajo de la descripción -->
			{#if detalle.imagenes && detalle.imagenes[0]}
				<div class="group relative overflow-hidden mb-16">
					<img
						src={detalle.imagenes[0]}
						alt={ubicacion.nombre_ubicacion}
						class="h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[500px]"
					/>
					<!-- Indicador minimalista -->
					<div class="absolute top-4 right-4 h-1.5 w-1.5 bg-white/40"></div>
				</div>
			{/if}

			<!-- Historia con línea verde a la derecha -->
			{#if detalle.historia}
				<section class="mb-16 md:mb-20">
					<div class="flex gap-6">
						<!-- Contenido -->
						<div class="flex-1">
							<p class="text-sm leading-loose font-extralight tracking-wide whitespace-pre-line text-white/60 md:text-base">
								{detalle.historia}
							</p>
						</div>

						<!-- Línea verde vertical a la derecha -->
						<div class="w-1 flex-shrink-0 bg-green-400"></div>
					</div>
				</section>
			{/if}

            <div class="w-full flex items-center justify-center mb-12 gap-2.5">
                <!-- Botón de disponibilidad -->
                 <button
					class="inline-flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 text-white font-extralight tracking-[0.3em] py-3 px-8 transition-all duration-300 uppercase text-xs"
				>
					AVÍSAME CUANDO ESTÉ DISPONIBLE
				</button>

                <!-- Botón de disponibilidad -->
                 <button
					class="inline-flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 text-white font-extralight tracking-[0.3em] py-3 px-8 transition-all duration-300 uppercase text-xs"
				>
					RESERVAR AHORA
				</button>
            </div>
            

			<!-- Galería masonry -->
			{#if detalle.imagenes && detalle.imagenes.length > 1}
				<section class="mb-16">
					<GaleriaMasonry
						imagenes={detalle.imagenes.slice(1)}
						alt={ubicacion.nombre_ubicacion}
					/>
				</section>
			{/if}

			<!-- Botón de regreso -->
			<div class="mt-16 flex justify-center">
				<a
					href="/experiencias"
					class="inline-flex items-center gap-3 text-white/30 font-extralight text-xs tracking-[0.4em] uppercase hover:text-white/60 transition-colors duration-300"
				>
					← Ver todas las experiencias
				</a>
			</div>
		</div>
	</div>
</div>

<!-- Flechas de navegación entre destinos (fixed, centradas verticalmente) -->
{#if destAnterior}
	<button
		on:click={irAnterior}
		aria-label="Destino anterior: {destAnterior.nombre_ubicacion}"
		class="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 group"
	>
		<svg class="w-7 h-7 text-white/60 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 19l-7-7 7-7" />
		</svg>
		<span class="text-[9px] font-extralight tracking-[0.2em] text-white/30 group-hover:text-white/60 uppercase transition-colors duration-300 max-w-[56px] text-center leading-tight line-clamp-2">{destAnterior.nombre_ubicacion}</span>
	</button>
{/if}

{#if destSiguiente}
	<button
		on:click={irSiguiente}
		aria-label="Destino siguiente: {destSiguiente.nombre_ubicacion}"
		class="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 group"
	>
		<svg class="w-7 h-7 text-white/60 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5l7 7-7 7" />
		</svg>
		<span class="text-[9px] font-extralight tracking-[0.2em] text-white/30 group-hover:text-white/60 uppercase transition-colors duration-300 max-w-[56px] text-center leading-tight line-clamp-2">{destSiguiente.nombre_ubicacion}</span>
	</button>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.6s ease-out;
	}
</style>
