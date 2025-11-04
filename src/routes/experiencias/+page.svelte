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

<section class="relative h-[80vh] w-full overflow-hidden md:h-[85vh]">
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
