<script>
	import portada from '$lib/assets/backgrounds/bgBanner.jpg';
	import TarcilaBackground from '$lib/assets/backgrounds/tarcila.jpg';
	import ExperienciasBusqueda from '$lib/components/ExperienciasBusqueda.svelte';
	import { onMount } from 'svelte';
	import ToursDestacados from '$lib/components/toursDestacados.svelte';
	import ExperienciaActiva from '$lib/components/ExperienciaActiva.svelte';

	let experiencias = [];
	export let data;

	$: experiencias = data.props.experiencias;
	$: ubicaciones = data.props.ubicaciones;
	$: experienciaActiva = data.props.experienciaActiva;
</script>

<ExperienciaActiva {experienciaActiva} />

<div class="bg-black h-10"></div>

<!-- Sombreado de transición -->
<div class="relative h-82 bg-gradient-to-b from-black via-black/60 to-transparent z-10"></div>

<!-- Sección de portada -->
<section 
	class="relative h-[80vh] w-full overflow-hidden md:h-[40vh] -mt-82"
	style="background-image: url({TarcilaBackground}); background-size: cover; background-position: center; background-attachment: fixed;"
>
	<!-- Overlay -->
	<!-- <div class="absolute inset-0 bg-black/40"></div> -->

	<!-- Texto flotante -->
	<div class="absolute inset-0 flex items-center justify-end px-6 text-right md:px-20 z-10">
		<div class="text-white">
			<p class="text-sm tracking-wide uppercase md:text-base">Conoce nuestras</p>
			<h1 class="text-3xl font-extrabold tracking-wider md:text-5xl">Experiencias Nativo</h1>
		</div>
	</div>
</section>

<!-- Sección con background compartido -->
<div 
	class="relative"
	style="background-image: url({TarcilaBackground}); background-size: cover; background-position: center; background-attachment: fixed;"
>
	<!-- Overlay oscuro -->
	<!-- <div class="absolute inset-0 bg-black/70"></div> -->
	
	<!-- Contenido -->
	<div class="relative z-10">
		<ExperienciasBusqueda {experiencias} />
		<ToursDestacados {ubicaciones} />
		
		<!-- Sección: Por qué nuestras experiencias son únicas -->
		<section class="py-12">
			<div class="max-w-7xl mx-auto px-6">
				<h2 class="text-center text-white font-bold text-xl tracking-wider mb-6">POR QUE NUESTRAS EXPERIENCIAS SON UNICAS</h2>

				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
					<div class="bg-neutral-900/40 backdrop-blur-md p-6 rounded-lg border border-white/10">
						<h3 class="text-sm font-bold text-white mb-2">TOUR</h3>
						<p class="text-sm text-gray-300">Itinerario especializado para que disfrutes de cada momento</p>
					</div>

					<div class="bg-neutral-900/40 backdrop-blur-md p-6 rounded-lg border border-white/10">
						<h3 class="text-sm font-bold text-white mb-2">HOSPEDAJE Y EXPERIENCIA</h3>
						<p class="text-sm text-gray-300">Instalaciones equipadas para cada experiencia, cabañas/hotel de 1 a 2 días con servicio de restaurante</p>
					</div>

					<div class="bg-neutral-900/40 backdrop-blur-md p-6 rounded-lg border border-white/10">
						<h3 class="text-sm font-bold text-white mb-2">TRANSPORTE</h3>
						<p class="text-sm text-gray-300">Transporte redondo con un coordinador turístico y seguro carretera</p>
					</div>

					<div class="bg-neutral-900/40 backdrop-blur-md p-6 rounded-lg border border-white/10">
						<h3 class="text-sm font-bold text-white mb-2">SET EN VIVO</h3>
						<p class="text-sm text-gray-300">Música en vivo de los mejores djs locales</p>
					</div>
				</div>

				<div class="flex justify-center">
					<a href="/cotizacion" class="inline-block bg-black text-white px-6 py-3 rounded shadow-md hover:opacity-90 tracking-wider font-semibold">Cotización personalizada</a>
				</div>
			</div>
		</section>
	</div>
</div>
