<script>
	/**
	 * GaleriaMasonry.svelte
	 * Galería masonry reutilizable con lightbox.
	 *
	 * Props:
	 *   imagenes  string[]  Array de URLs públicas de las imágenes
	 *   alt       string    Texto alternativo base para las imágenes
	 */
	export let imagenes = [];
	export let alt = 'Imagen';

	// ── Distribución round-robin en columnas ──────────────────────────
	const NUM_COLS = 3;
	$: columnas = (() => {
		return Array.from({ length: NUM_COLS }, (_, colIdx) =>
			imagenes
				.map((src, i) => ({ src, idx: i }))
				.filter((_, i) => i % NUM_COLS === colIdx)
		);
	})();

	// ── Lightbox ──────────────────────────────────────────────────────
	let imagenSeleccionada = null;
	let indiceActual = 0;

	function abrir(src, idx) {
		imagenSeleccionada = src;
		indiceActual = idx;
	}

	function cerrar() {
		imagenSeleccionada = null;
	}

	function anterior() {
		if (indiceActual > 0) {
			indiceActual--;
			imagenSeleccionada = imagenes[indiceActual];
		}
	}

	function siguiente() {
		if (indiceActual < imagenes.length - 1) {
			indiceActual++;
			imagenSeleccionada = imagenes[indiceActual];
		}
	}

	function manejarTecla(e) {
		if (!imagenSeleccionada) return;
		if (e.key === 'Escape') cerrar();
		if (e.key === 'ArrowLeft') anterior();
		if (e.key === 'ArrowRight') siguiente();
	}
</script>

<svelte:window on:keydown={manejarTecla} />

{#if imagenes && imagenes.length > 0}
	<!-- Grid masonry: columnas flex con distribución round-robin -->
	<div class="flex gap-3">
		{#each columnas as columna}
			<div class="flex flex-1 flex-col gap-3">
				{#each columna as { src, idx }}
					<button
						on:click={() => abrir(src, idx)}
						aria-label="Ver imagen {idx + 1}"
						class="group relative cursor-pointer overflow-hidden"
					>
						<img
							{src}
							alt="{alt} {idx + 1}"
							class="block w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<!-- Overlay hover -->
						<div class="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
							<svg class="h-8 w-8 text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
							</svg>
						</div>
						<!-- Indicador -->
						<div class="absolute top-2 right-2 h-1 w-1 bg-white/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
					</button>
				{/each}
			</div>
		{/each}
	</div>
{/if}

<!-- Lightbox -->
{#if imagenSeleccionada}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
		on:click={cerrar}
		role="button"
		tabindex="0"
		on:keydown={(e) => e.key === 'Enter' && cerrar()}
	>
		<!-- Cerrar -->
		<button
			on:click={cerrar}
			class="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/60 text-white/50 transition-all duration-300 hover:border-white/40 hover:text-white/80"
			aria-label="Cerrar"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>

		<!-- Contador -->
		<div class="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 text-xs font-extralight text-white/50 tracking-widest backdrop-blur-sm">
			{indiceActual + 1} / {imagenes.length}
		</div>

		<!-- Anterior -->
		{#if indiceActual > 0}
			<button
				on:click|stopPropagation={anterior}
				class="absolute left-4 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/60 text-white/50 transition-all duration-300 hover:border-white/40 hover:text-white/80"
				aria-label="Imagen anterior"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
		{/if}

		<!-- Siguiente -->
		{#if indiceActual < imagenes.length - 1}
			<button
				on:click|stopPropagation={siguiente}
				class="absolute right-4 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/60 text-white/50 transition-all duration-300 hover:border-white/40 hover:text-white/80"
				aria-label="Imagen siguiente"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		{/if}

		<!-- Imagen -->
		<img
			src={imagenSeleccionada}
			alt="Vista completa"
			class="max-h-full max-w-full object-contain"
			on:click|stopPropagation
			role="presentation"
		/>
	</div>
{/if}
