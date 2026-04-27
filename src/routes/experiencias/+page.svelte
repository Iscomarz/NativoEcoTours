<script>
	import portada from '$lib/assets/backgrounds/bgBanner.jpg';
	import TarcilaBackground from '$lib/assets/backgrounds/tarcila.jpg';
	import ExperienciasBusqueda from '$lib/components/ExperienciasBusqueda.svelte';
	import { onMount } from 'svelte';
	import ToursDestacados from '$lib/components/ToursDestacados.svelte';
	import ExperienciaActiva from '$lib/components/ExperienciaActiva.svelte';
	import ButtonCotizacion from '$lib/components/ButtonCotizacion.svelte';

	let experiencias = [];
	export let data;

	$: experiencias = data?.props?.experiencias || [];
	$: ubicaciones = data?.props?.ubicaciones || [];
	$: experienciaActiva = data?.props?.experienciaActiva;
</script>

<!-- Sección superior -->
{#if experienciaActiva != null}
	<div class="bg-black">
		<ExperienciaActiva {experienciaActiva} />
	</div>
{:else}
	<!-- Hero de fallback cuando no hay experiencia activa -->
	<section class="relative h-[70vh] flex items-center justify-center overflow-hidden bg-black">
		<!-- Fondo con imagen de portada difuminada -->
		<div class="absolute inset-0">
			<img src={portada} alt="Fondo Nativo" class="w-full h-full object-cover opacity-40 scale-110 blur-[2px]" />
			<div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/80"></div>
		</div>
		
		<div class="relative z-10 text-center px-6 max-w-4xl">
			<span class="text-white/40 text-[10px] tracking-[0.6em] uppercase mb-6 block animate-pulse">Explora lo desconocido</span>
			<h1 class="text-white font-extralight text-4xl md:text-6xl tracking-[0.2em] uppercase mb-8 leading-tight">
				Nuevas aventuras <br />
				<span class="text-white/60 text-3xl md:text-5xl">en preparación</span>
			</h1>
			<p class="text-white/40 font-extralight text-sm md:text-base tracking-[0.1em] mb-12 max-w-2xl mx-auto leading-relaxed">
				Actualmente estamos preparando nuestra próxima gran aventura. Mientras tanto, puedes explorar nuestros destinos habituales o registrarte para ser el primero en recibir notificaciones.
			</p>
			
			<div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
				<button 
					on:click={() => document.getElementById('explorar')?.scrollIntoView({behavior: 'smooth'})}
					class="group relative px-10 py-4 overflow-hidden border border-white/10 transition-all duration-500 hover:border-white/40"
				>
					<div class="absolute inset-0 bg-white translate-y-[101%] transition-transform duration-500 group-hover:translate-y-0"></div>
					<span class="relative text-xs tracking-[0.4em] uppercase text-white transition-colors duration-500 group-hover:text-black font-light">Ver destinos</span>
				</button>
				
				<a href="/login" class="text-white/30 text-xs tracking-[0.4em] uppercase hover:text-white transition-colors duration-300 flex items-center gap-2 group">
					<span>Avisar de próximas fechas</span>
					<span class="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
				</a>
			</div>
		</div>

		<!-- Elementos decorativos sutiles -->
		<div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20">
			<span class="text-[8px] uppercase tracking-[0.4em] text-white">Scroll</span>
			<div class="w-[1px] h-10 bg-gradient-to-b from-white to-transparent"></div>
		</div>
	</section>
{/if}

<!-- Contenido inferior con background tarcila -->
<div
	class="relative"
	style="background-image: url({TarcilaBackground}); background-size: cover; background-position: center; background-attachment: fixed;"
>
	<!-- Degradado desde negro arriba para continuidad -->
	<div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>

	<!-- Contenido -->
	<div class="relative z-10">
		<ExperienciasBusqueda {experiencias} />
		<ToursDestacados {ubicaciones} />
		
		<!-- Sección: Por qué nuestras experiencias son únicas -->
		<section class="py-12">
			<div class="max-w-7xl mx-auto px-6">
				<h2 class="text-center text-white font-extralight text-xs tracking-[0.4em] uppercase mb-8">POR QUE NUESTRAS EXPERIENCIAS SON UNICAS</h2>

				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
					<div class="bg-neutral-900/40 backdrop-blur-md p-6 border border-white/10">
						<h3 class="text-xs font-light text-white/80 mb-2 tracking-widest uppercase">TOUR</h3>
						<p class="text-xs text-white/40 font-extralight leading-relaxed">Itinerario especializado para que disfrutes de cada momento</p>
					</div>

					<div class="bg-neutral-900/40 backdrop-blur-md p-6 border border-white/10">
						<h3 class="text-xs font-light text-white/80 mb-2 tracking-widest uppercase">HOSPEDAJE Y EXPERIENCIA</h3>
						<p class="text-xs text-white/40 font-extralight leading-relaxed">Instalaciones equipadas para cada experiencia, cabañas/hotel de 1 a 2 días con servicio de restaurante</p>
					</div>

					<div class="bg-neutral-900/40 backdrop-blur-md p-6 border border-white/10">
						<h3 class="text-xs font-light text-white/80 mb-2 tracking-widest uppercase">TRANSPORTE</h3>
						<p class="text-xs text-white/40 font-extralight leading-relaxed">Transporte redondo con un coordinador turístico y seguro carretera</p>
					</div>

					<div class="bg-neutral-900/40 backdrop-blur-md p-6 border border-white/10">
						<h3 class="text-xs font-light text-white/80 mb-2 tracking-widest uppercase">SET EN VIVO</h3>
						<p class="text-xs text-white/40 font-extralight leading-relaxed">Música en vivo de los mejores djs locales</p>
					</div>
				</div>

				<div class="flex justify-center pb-8">
					<ButtonCotizacion />
				</div>
			</div>
		</section>
	</div>
</div>
