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

	$: experiencias = data.props.experiencias;
	$: ubicaciones = data.props.ubicaciones;
	$: experienciaActiva = data.props.experienciaActiva;
</script>

<!-- Sección con fondo negro para la experiencia activa -->
<div class="bg-black">
	<ExperienciaActiva {experienciaActiva} />
</div>

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
