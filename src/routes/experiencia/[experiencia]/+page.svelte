<script>
	import HabitacionCard from '$lib/components/cards/HabitacionCard.svelte';
	import GaleriaMasonry from '$lib/components/GaleriaMasonry.svelte';
	import bgHojasSombreado from '$lib/assets/backgrounds/bgHojasSombreado.jpg';
	import { onMount } from 'svelte';
	import ButtonCotizacion from '$lib/components/ButtonCotizacion.svelte';

	import { goto } from '$app/navigation';
	import { on } from 'svelte/events';

	let experiencia = {};
	let ruta = '';
	export let data;

	$: experiencia = data.experiencia;
	$: ruta = data.ruta;

	onMount(() => {
		console.log('Experiencia cargada:', experiencia);
	});

	// Función para formatear la fecha tipo "Del 1 al 3 de Noviembre 2024"
	function getFechaBonita(inicio, fin) {
		if (!inicio || !fin) return '';
		const meses = [
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre'
		];
		const d1 = new Date(inicio);
		const d2 = new Date(fin);
		// Si el mes es igual, formato: Del 1 al 3 de Noviembre 2024
		if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
			return `Del ${d1.getDate()} al ${d2.getDate()} de ${meses[d1.getMonth()]} ${d1.getFullYear()}`;
		}
		// Si el mes es diferente, formato: Del 29 de Octubre al 2 de Noviembre 2024
		return `Del ${d1.getDate()} de ${meses[d1.getMonth()]} al ${d2.getDate()} de ${meses[d2.getMonth()]} ${d1.getFullYear()}`;
	}
</script>

<!-- Portada -->
<section class="relative h-[80vh] w-full overflow-hidden">
	<img
		src={experiencia.portada_experiencia || bgHojasSombreado}
		alt={experiencia.titulo}
		class="h-full w-full object-cover"
	/>
	<div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
    <div class="absolute inset-0 bg-black/40"></div>
	<div class="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
		<h1 class="text-2xl font-extralight tracking-widest text-white drop-shadow-lg md:text-3xl">
			{experiencia.titulo}
		</h1>
		<p class="mt-3 text-xs text-white/50 font-extralight tracking-[0.3em] uppercase drop-shadow md:text-sm">
			{getFechaBonita(experiencia.fecha_inicio, experiencia.fecha_fin)}
		</p>
		<button
			on:click={() => {
				const element = document.getElementById('habitaciones-section');
				if (element) {
					const yOffset = -100; // Offset de 100px arriba
					const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
					window.scrollTo({ top: y, behavior: 'smooth' });
				}
			}}
			class="mt-6 inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 text-white font-extralight tracking-[0.3em] py-3 px-8 transition-all duration-300 uppercase text-xs"
		>
			<span>RESERVAR</span>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
				><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg
			>
		</button>
	</div>
</section>

<!-- Contenido principal -->
<div class="min-h-screen w-full bg-black py-8">
	<div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row">
		<!-- Columna izquierda (Galería + Breadcrumbs) -->
		<div class="flex w-full flex-col gap-6 md:w-[60%]">
			<!-- Breadcrumb -->
			<div>
				<button
					on:click={() => goto('/experiencias')}
					class="mb-6 flex cursor-pointer items-center gap-2 text-white/30 hover:text-white/60 transition-colors duration-300 text-xs font-extralight tracking-[0.3em] uppercase"
				>
					<svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
						><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg
					>
					Experiencias
				</button>
			</div>
			<!-- Galería masonry con lightbox -->
			<GaleriaMasonry
				imagenes={experiencia.detalle?.imagenes ?? []}
				alt={experiencia.titulo}
			/>
		</div>
		<!-- Columna derecha (info general + acciones) -->
		<div class="flex w-full flex-col gap-6 md:w-[40%]">
			<div>
				<p class="text-xs text-green-400/60 font-extralight tracking-[0.4em] uppercase mb-1">Experiencia</p>
				<h2 class="text-xl font-extralight tracking-widest text-white mb-4">{experiencia.titulo}</h2>
				<div class="flex items-center gap-2 mb-4 text-white/40">
					<svg class="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					<span class="text-xs font-extralight tracking-[0.25em] uppercase">{experiencia.cubicacion?.nombre_ubicacion || experiencia.ubicacion}</span>
				</div>
				<div class="w-8 h-px bg-white/20 mb-4"></div>
				<p class="leading-loose whitespace-pre-line text-white/60 text-sm font-extralight tracking-wide">
					{experiencia.detalle.descripcion}
				</p>
			</div>
			<!-- Acciones -->
			<div class="mt-4 flex flex-col gap-3 text-black">
				<button
					on:click={() => {
						const element = document.getElementById('habitaciones-section');
						if (element) {
							const yOffset = -100;
							const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
							window.scrollTo({ top: y, behavior: 'smooth' });
						}
					}}
					class="inline-flex items-center justify-center gap-3 bg-white/5 border border-white/20 hover:bg-white/10 px-5 py-3 font-extralight tracking-widest text-white text-xs uppercase transition-all duration-300"
				>
					<span>RESERVAR</span>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
						><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg
					>
				</button>
				<ButtonCotizacion />
			</div>

			<div>
				<h2 class="mb-2 text-xs font-light tracking-widest text-white/50 uppercase">HOTEL SEDE</h2>
				<p class="leading-loose whitespace-pre-line text-white/50 text-xs font-extralight tracking-wide">{experiencia.detalle.sede}</p>

				<h2 class="mb-2 mt-6 text-xs font-light tracking-widest text-white/50 uppercase">ACTIVIDADES</h2>
				<p class="leading-loose whitespace-pre-line text-white/50 text-xs font-extralight tracking-wide">
					{experiencia.detalle.actividades}
				</p>

				<h2 class="mb-2 mt-6 text-xs font-light tracking-widest text-white/50 uppercase">INCLUYE</h2>
				<p class="leading-loose whitespace-pre-line text-white/50 text-xs font-extralight tracking-wide">
					{experiencia.detalle.queincluye}
				</p>
			</div>
		</div>
	</div>

	<!-- Habitaciones -->
	{#if experiencia.habitaciones && experiencia.habitaciones.length > 0}
		<section id="habitaciones-section" class="py-12">
			<div class="max-w-6xl mx-auto px-4 mb-8">
				<p class="text-xs text-green-400/50 font-extralight tracking-[0.4em] uppercase mb-1">Selección</p>
				<h2 class="text-lg font-extralight tracking-widest text-white/70 uppercase">Habitaciones Disponibles</h2>
				<div class="w-8 h-px bg-white/20 mt-3"></div>
			</div>
			<div class="flex justify-center gap-6 overflow-x-auto pb-4 flex-wrap">
				{#each experiencia.habitaciones as hab}
					<HabitacionCard
						id={hab.id}
						nombre={hab.nombre}
						capacidad={hab.capacidad}
						precioPersona={`$${hab.precioPersona} por persona`}
						precioCuarto={`$${hab.precioCuarto} por cuarto`}
						portada={hab.portada}
						conteo={hab.conteo}
						lleno={hab.lleno}
						idexperiencia={hab.idexperiencia}
                        slot={hab.ruta}
                        ruta={ruta}
					/>
				{/each}
			</div>
		</section>
	{/if}
</div>
