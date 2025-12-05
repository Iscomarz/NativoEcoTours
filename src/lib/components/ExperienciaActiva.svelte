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
		console.log('🔍 ExperienciaActiva recibida:', experienciaActiva);
		console.log('🔍 Imágenes disponibles:', experienciaActiva?.detalle?.imagenes);
		console.log('🔍 Cantidad de imágenes:', experienciaActiva?.detalle?.imagenes?.length);
		console.log('🔍 Primera imagen:', experienciaActiva?.detalle?.imagenes?.[0]);

		if (experienciaActiva?.detalle?.imagenes?.length > 1) {
			console.log('⏰ Iniciando slideshow automático');
			intervalId = setInterval(() => {
				const newIndex = (currentImageIndex + 1) % experienciaActiva.detalle.imagenes.length;
				console.log('🔄 Cambiando a imagen índice:', newIndex);
				currentImageIndex = newIndex;
			}, 5000);
		} else {
			console.log('📷 Solo una imagen disponible, no se inicia slideshow');
		}
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<div class="pt-20">
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
			<div class="absolute top-8 left-8 z-20 max-w-lg">
				<div class="bg-black/50 rounded-lg p-6">
					<div class="space-y-4 text-white">
						<!-- Título -->
						<h1 class="text-4xl leading-tight font-bold drop-shadow-lg md:text-5xl">
							{experienciaActiva.titulo}
						</h1>

						<!-- Descripción -->
						{#if experienciaActiva.descripcion}
							<p class="text-lg leading-relaxed opacity-90 drop-shadow-md md:text-xl">
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
								<span class="opacity-90">{experienciaActiva.cubicacion.nombre_ubicacion}</span>
							</div>
						{/if}

						<!-- Fechas -->
						{#if experienciaActiva.fecha_inicio && experienciaActiva.fecha_fin}
							<div class="mt-6 inline-block">
								<div
									class="bg-opacity-40 border-opacity-30 rounded-lg border border-white bg-black px-4 py-2 backdrop-blur-sm"
								>
									<div class="flex items-center space-x-2 text-white">
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
												d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
										<span class="text-lg font-semibold">
											{formatearFechas(experienciaActiva.fecha_inicio, experienciaActiva.fecha_fin)}
										</span>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Indicador de click -->
			<div class="absolute right-8 bottom-8 z-10">
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
				<div class="absolute bottom-8 left-8 z-10">
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

			<!-- Sombreado gradiente inferior -->
			<div class="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black/95 via-black/80 to-transparent pointer-events-none z-20"></div>
		</div>
	{/if}
</div>
