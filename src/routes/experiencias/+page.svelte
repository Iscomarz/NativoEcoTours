<script>
	import portada from '$lib/assets/backgrounds/bgBanner.jpg';
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

<section class="relative h-[80vh] w-full overflow-hidden md:h-[65vh] -mt-82">
	<!-- Imagen de fondo -->
	<img src={portada} alt="Experiencias Nativo" class="h-full w-full object-cover bg-gradient-to-t from-black via-black/80 to-transparent" />

	<!-- Overlay -->
	<div class="absolute inset-0 bg-black/40"></div>

	<!-- Texto flotante -->
	<div class="absolute inset-0 flex items-center justify-end px-6 text-right md:px-20">
		<div class="text-white">
			<p class="text-sm tracking-wide uppercase md:text-base">Conoce nuestras</p>
			<h1 class="text-3xl font-extrabold tracking-wider md:text-5xl">Experiencias Nativo</h1>
		</div>
	</div>
</section>

<ExperienciasBusqueda {experiencias} />

<ToursDestacados {ubicaciones} />

<!-- Sección: Por qué nuestras experiencias son únicas -->
<section class="bg-neutral-900 py-12">
	<div class="max-w-6xl mx-auto px-6">
		<h2 class="text-center text-white font-bold text-xl tracking-wider mb-6">POR QUE NUESTRAS EXPERIENCIAS SON UNICAS</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
			<div class="bg-neutral-900/40 p-6 rounded-lg border border-white/10">
				<h3 class="text-sm font-bold text-white mb-2">TOUR</h3>
				<p class="text-sm text-gray-300">Itinerario especializado para que disfrutes de cada momento</p>
			</div>

			<div class="bg-neutral-900/40 p-6 rounded-lg border border-white/10">
				<h3 class="text-sm font-bold text-white mb-2">HOSPEDAJE Y EXPERIENCIA</h3>
				<p class="text-sm text-gray-300">Instalaciones equipadas para cada experiencia, cabañas/hotel de 1 a 2 días con servicio de restaurante</p>
			</div>

			<div class="bg-neutral-900/40 p-6 rounded-lg border border-white/10">
				<h3 class="text-sm font-bold text-white mb-2">TRANSPORTE</h3>
				<p class="text-sm text-gray-300">Transporte redondo con un coordinador turístico y seguro carretera</p>
			</div>

			<div class="bg-neutral-900/40 p-6 rounded-lg border border-white/10">
				<h3 class="text-sm font-bold text-white mb-2">SET EN VIVO</h3>
				<p class="text-sm text-gray-300">Música en vivo de los mejores djs locales</p>
			</div>
		</div>

		<div class="flex justify-center">
			<a href="/cotizacion" class="inline-block bg-black text-white px-6 py-3 rounded shadow-md hover:opacity-90 tracking-wider font-semibold">Cotización personalizada</a>
		</div>
	</div>
</section>
