<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	export let experienciaActiva;

	let currentImageIndex = 0;
	let intervalId;

	// Función para formatear fechas
	function formatearFechas(fechaInicio, fechaFin) {
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

		const inicio = new Date(fechaInicio);
		const fin = new Date(fechaFin);

		const diaInicio = inicio.getDate().toString().padStart(2, '0');
		const diaFin = fin.getDate().toString().padStart(2, '0');
		const mes = meses[inicio.getMonth()];

		return `Del ${diaInicio} al ${diaFin} de ${mes}`;
	}

	// Función para navegar a la experiencia
	function navegarAExperiencia() {
		if (experienciaActiva?.titulo) {
			const ruta = `/experiencia/${experienciaActiva.titulo.replace(/\s+/g, '-')}`;
			goto(ruta);
		}
	}

	// Configurar slideshow automático
	onMount(() => {
		//console.log('🔍 ExperienciaActiva recibida:', experienciaActiva);
		//console.log('🔍 Imágenes disponibles:', experienciaActiva?.detalle?.imagenes);
		//console.log('🔍 Cantidad de imágenes:', experienciaActiva?.detalle?.imagenes?.length);
		//console.log('🔍 Primera imagen:', experienciaActiva?.detalle?.imagenes?.[0]);

		if (experienciaActiva?.detalle?.imagenes?.length > 1) {
			intervalId = setInterval(() => {
				const newIndex = (currentImageIndex + 1) % experienciaActiva.detalle.imagenes.length;
				currentImageIndex = newIndex;
			}, 5000);
		} else {
			//console.log('📷 Solo una imagen disponible, no se inicia slideshow');
		}
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<div class="bg-black">
	<!-- Componente clickeable de experiencia activa -->
	{#if experienciaActiva}
		<div
			class="group relative h-screen w-full cursor-pointer overflow-hidden"
			on:click={navegarAExperiencia}
			on:keydown={(e) => e.key === 'Enter' && navegarAExperiencia()}
			role="button"
			tabindex="0"
		>

			<!-- Slideshow de imágenes -->
			{#if experienciaActiva.detalle?.imagenes?.length > 0}
				<div class="absolute inset-0 bg-gray-200">
					{#each experienciaActiva.detalle.imagenes as imagen, index}
						<div
							class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
							class:opacity-100={index === currentImageIndex}
							class:opacity-0={index !== currentImageIndex}
						>
							<img
								src={imagen}
								alt={experienciaActiva.titulo || 'Experiencia'}
								class="h-full w-full object-cover"
								crossorigin="anonymous"
								loading="eager"
								on:error={(e) => {
									console.error('❌ Error cargando imagen:', imagen);
									console.error('❌ Error details:', e.target, e);
								}}
								on:load={(e) => {
									console.log('✅ Imagen cargada exitosamente:', imagen);
									console.log('✅ Image element:', e.target);
								}}
							/>
						</div>
					{/each}
				</div>
			{:else}
				<!-- Fallback si no hay imágenes -->
				<div
					class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900"
				>
					<div class="text-center text-white">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mx-auto mb-4 h-24 w-24 opacity-50"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<p class="text-lg opacity-70">Sin imágenes disponibles</p>
					</div>
				</div>
			{/if}

			<!-- Información flotante -->
			<div class="absolute bottom-12 left-4 right-4 sm:left-8 sm:right-8 md:left-12 md:right-auto md:max-w-2xl lg:max-w-3xl xl:max-w-4xl z-30">
				<div class="rounded-lg p-4 sm:p-6">
					<div class="space-y-1 text-white">
						<!-- Badge diferenciador -->
						<div class="flex items-center gap-2 mb-2">
							<span class="relative flex h-2 w-2">
								<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
								<span class="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
							</span>
							<span class="text-green-400 text-xs font-extralight tracking-[0.35em] uppercase">Próxima experiencia</span>
						</div>
						<!-- Título -->
						<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight font-extralight tracking-widest drop-shadow-lg break-words">
							{experienciaActiva.titulo}
						</h1>

						<!-- Descripción -->
						{#if experienciaActiva.descripcion}
							<p class="font-extralight text-sm sm:text-base leading-relaxed text-white/60 drop-shadow-md break-words tracking-wide">
								{experienciaActiva.descripcion}
							</p>
						{/if}

						<!-- Ubicación -->
						{#if experienciaActiva.cubicacion?.nombre_ubicacion}
							<div class="flex items-center space-x-2 text-lg drop-shadow-md">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								<span class="text-xs font-extralight tracking-[0.3em] uppercase opacity-70">{experienciaActiva.cubicacion.nombre_ubicacion}</span>
							</div>
						{/if}

						<!-- Fechas -->
						{#if experienciaActiva.fecha_inicio && experienciaActiva.fecha_fin}
							<div class="inline-block">
									<div class="flex items-center space-x-2 text-white/70">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
										<span class="text-xs font-extralight tracking-widest">
											{formatearFechas(experienciaActiva.fecha_inicio, experienciaActiva.fecha_fin)}
										</span>
									</div>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Indicador de click -->
			<div class="absolute left-8 bottom-8 z-10">
				<div class="text-white opacity-75 transition-opacity duration-300 group-hover:opacity-100">
					<div class="flex items-center space-x-2 text-sm">
						<span>Explorar experiencia</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</div>
			</div>

			<!-- Indicadores de slideshow (opcional) -->
			{#if experienciaActiva.detalle?.imagenes?.length > 1}
				<div class="absolute top-8 left-8 z-10">
					<div class="flex space-x-2">
						{#each experienciaActiva.detalle.imagenes as _, index}
							<div
								class="h-2 w-2 rounded-full transition-all duration-300"
								class:bg-white={index === currentImageIndex}
								class:bg-gray-400={index !== currentImageIndex}
							></div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Gradiente inferior sutil solo en el borde -->
			<div class="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black to-transparent pointer-events-none z-10"></div>
			<!-- Gradiente izquierdo -->
			<div class="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black to-transparent pointer-events-none z-10"></div>
			<!-- Gradiente derecho -->
			<div class="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black to-transparent pointer-events-none z-10"></div>
			<!-- Gradiente superior -->
			<div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none z-20"></div>
		</div>
	{/if}
</div>
