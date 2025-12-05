<script>
	import { onMount } from 'svelte';
    import logoNativo from '$lib/assets/logos/logoNativo.png';

	let ubicacion = {};
	let detalle = {};
	export let data;

	$: ubicacion = data.ubicacion;
	$: detalle = data.detalle;

	// Estado para la galería en pantalla completa
	let imagenSeleccionada = null;
	let indiceImagenActual = 0;

	function abrirImagenCompleta(imagen, indice) {
		imagenSeleccionada = imagen;
		indiceImagenActual = indice;
	}

	function cerrarImagenCompleta() {
		imagenSeleccionada = null;
	}

	function imagenAnterior() {
		if (indiceImagenActual > 0) {
			indiceImagenActual--;
			imagenSeleccionada = detalle.imagenes[indiceImagenActual];
		}
	}

	function imagenSiguiente() {
		if (indiceImagenActual < detalle.imagenes?.length - 1) {
			indiceImagenActual++;
			imagenSeleccionada = detalle.imagenes[indiceImagenActual];
		}
	}

	// Navegación con teclado
	function manejarTecla(event) {
		if (!imagenSeleccionada) return;

		if (event.key === 'Escape') cerrarImagenCompleta();
		if (event.key === 'ArrowLeft') imagenAnterior();
		if (event.key === 'ArrowRight') imagenSiguiente();
	}

	onMount(() => {
		console.log('Página de ubicación montada');
		console.log('Ubicación:', ubicacion);
		console.log('Detalle:', detalle);
	});
</script>

<svelte:window on:keydown={manejarTecla} />

<!-- Página de ubicación con diseño minimalista oscuro -->
<div class="min-h-screen bg-black text-white">
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

		<!-- Indicador verde en la esquina -->
		<div
			class="absolute top-8 right-8 h-3 w-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"
		></div>

		<!-- Contenido del hero -->
		<div class="absolute right-0 bottom-0 left-0 px-6 pb-12 md:px-12 md:pb-16 lg:px-24">
			<div class="mx-auto max-w-6xl">
				<!-- Ubicación con ícono -->
				<div class="animate-fade-in mb-4 flex items-center text-green-400">
					<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
					<span class="text-sm font-medium tracking-wider uppercase md:text-base"
						>{ubicacion.estado_ubicacion}, {ubicacion.pais_ubicacion}</span
					>
				</div>

				<!-- Nombre de la ubicación y logo con space-between -->
				<div class="flex items-end justify-between gap-4 mb-4">
					<h1 class="text-4xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl">
						{ubicacion.nombre_ubicacion}
					</h1>
					<img 
						src={logoNativo} 
						alt="Nativo Eco Tours" 
						class="h-16 w-auto md:h-20 lg:h-18 opacity-90 hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
					/>
				</div>

				<!-- Línea decorativa -->
				<div class="h-1 w-32 rounded-full bg-green-400"></div>
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
							<p class="mb-8 text-lg leading-relaxed whitespace-pre-line text-gray-300 md:text-xl">
								{detalle.descripcion_larga}
							</p>
						</div>
					</div>
				</section>
			{/if}

			<!-- Imagen destacada debajo de la descripción -->
			{#if detalle.imagenes && detalle.imagenes[0]}
				<div class="group relative overflow-hidden rounded-2xl shadow-2xl">
					<img
						src={detalle.imagenes[0]}
						alt={ubicacion.nombre_ubicacion}
						class="h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[500px]"
					/>
					<!-- Indicador verde en la esquina -->
					<div
						class="absolute top-4 right-4 h-3 w-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"
					></div>
				</div>
			{/if}

			<!-- Historia con línea verde a la derecha -->
			{#if detalle.historia}
				<section class="mb-16 md:mb-20">
					<div class="flex gap-6">
						<!-- Contenido -->
						<div class="flex-1">
							<p class="text-lg leading-relaxed whitespace-pre-line text-gray-300 md:text-xl">
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
					class="flex items-center gap-2 rounded bg-neutral-700 px-5 py-2 font-semibold text-white hover:bg-neutral-600"
				>
					AVÍSAME CUANDO ESTÉ DISPONIBLE
                    <svg
                        class="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 4v16m8-8H4"
                        ></path></svg>
				</button>

                <!-- Botón de disponibilidad -->
                 <button
					class="flex items-center gap-2 rounded bg-neutral-700 px-5 py-2 font-semibold text-white hover:bg-neutral-600"
				>
					RESERVAR AHORA
                    <svg
                        class="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 4v16m8-8H4"
                        ></path></svg>
					
				</button>
            </div>
            

			<!-- Galería con diseño tipo masonry (tamaños variados) -->
			{#if detalle.imagenes && detalle.imagenes.length > 1}
				<section class="mb-16">
					<!-- Grid masonry con tamaños variados -->
					<div class="grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4">
						{#each detalle.imagenes.slice(1) as imagen, index}
							{@const realIndex = index + 1}
							{@const isLarge = realIndex % 5 === 0 || realIndex % 7 === 0}
							{@const isTall = realIndex % 3 === 0 && !isLarge}
							{@const isWide = realIndex % 4 === 0 && !isLarge && !isTall}

							<button
								on:click={() => abrirImagenCompleta(imagen, realIndex)}
								class="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900 transition-transform duration-300 hover:scale-105
                                    {isLarge ? 'col-span-2 row-span-2' : ''}
                                    {isTall ? 'row-span-2' : ''}
                                    {isWide ? 'col-span-2' : ''}"
							>
								<img
									src={imagen}
									alt="Imagen {realIndex + 1} de {ubicacion.nombre_ubicacion}"
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>

								<!-- Overlay al hacer hover -->
								<div
									class="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40"
								>
									<svg
										class="h-12 w-12 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
										/>
									</svg>
								</div>

								<!-- Indicador verde en la esquina -->
								<div
									class="absolute top-3 right-3 h-2 w-2 rounded-full bg-green-400 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
								></div>
							</button>
						{/each}
					</div>
				</section>
			{/if}

			<!-- Botón de regreso -->
			<div class="mt-16 flex justify-center">
				<a
					href="/experiencias"
					class="group flex items-center rounded-full border-2 border-green-400 bg-neutral-900 px-8 py-4 font-bold tracking-wider text-green-400 uppercase transition-all duration-300 hover:bg-neutral-800 hover:shadow-lg hover:shadow-green-400/20"
				>
					<svg
						class="mr-3 h-5 w-5 transform transition-transform group-hover:-translate-x-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Ver todas las experiencias
				</a>
			</div>
		</div>
	</div>
</div>

<!-- Modal de imagen en pantalla completa -->
{#if imagenSeleccionada}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
		on:click={cerrarImagenCompleta}
		role="button"
		tabindex="0"
		on:keydown={(e) => e.key === 'Enter' && cerrarImagenCompleta()}
	>
		<!-- Botón cerrar -->
		<button
			on:click={cerrarImagenCompleta}
			class="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-green-400 bg-black/50 text-green-400 transition-all duration-300 hover:scale-110 hover:bg-black/70"
			aria-label="Cerrar"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>

		<!-- Contador de imágenes -->
		<div
			class="absolute top-4 left-1/2 -translate-x-1/2 rounded-full border border-green-400 bg-black/50 px-4 py-2 text-sm font-medium text-green-400 backdrop-blur-sm"
		>
			{indiceImagenActual + 1} / {detalle.imagenes?.length || 0}
		</div>

		<!-- Botón anterior -->
		{#if indiceImagenActual > 0}
			<button
				on:click|stopPropagation={imagenAnterior}
				class="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full border border-green-400 bg-black/50 text-green-400 transition-all duration-300 hover:scale-110 hover:bg-black/70"
				aria-label="Imagen anterior"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>
		{/if}

		<!-- Botón siguiente -->
		{#if indiceImagenActual < detalle.imagenes?.length - 1}
			<button
				on:click|stopPropagation={imagenSiguiente}
				class="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full border border-green-400 bg-black/50 text-green-400 transition-all duration-300 hover:scale-110 hover:bg-black/70"
				aria-label="Imagen siguiente"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		{/if}

		<!-- Imagen -->
		<img
			src={imagenSeleccionada}
			alt="Vista completa"
			class="max-h-full max-w-full rounded-lg object-contain"
			on:click|stopPropagation
			role="presentation"
		/>
	</div>
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
