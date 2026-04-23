<script>
	import { onMount, onDestroy } from 'svelte';

	export let id;
	export let nombre;
	export let capacidad;
	export let precioPersona;
	export let precioCuarto;
	export let portada;
	export let imagenes = [];
	export let conteo;
	export let lleno;
	export let idexperiencia;
	export let slot;
	export let ruta;

	let currentIndex = 0;
	let interval;

	$: slideImages = (imagenes && imagenes.length > 0 ? imagenes : (portada ? [portada] : [])).slice(0, 5);

	function startCarousel() {
		if (slideImages.length > 1 && !interval) {
			interval = setInterval(() => {
				currentIndex = (currentIndex + 1) % slideImages.length;
			}, 2000);
		}
	}

	function stopCarousel() {
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
		currentIndex = 0;
	}

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<div
	on:mouseenter={startCarousel}
	on:mouseleave={stopCarousel}
	role="group"
	class="group relative w-[280px] min-w-[280px] flex-shrink-0 snap-center overflow-hidden rounded-xl bg-neutral-900 shadow-lg"
>
	<a href="/experiencia/{ruta}/habitacion/{slot}" class="block">
		{#if slideImages.length > 0}
			<div class="relative h-[190px] w-full overflow-hidden">
				{#each slideImages as img, i}
					<img
						src={img}
						alt="{nombre} - {i + 1}"
						class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 {i === currentIndex ? 'opacity-100' : 'opacity-0'}"
					/>
				{/each}
			</div>
		{:else}
			<div class="flex h-[190px] w-full flex-col items-center justify-start pt-5 bg-gradient-to-br from-neutral-800 to-neutral-950">
				<div class="relative flex items-center justify-center">
					<div class="absolute h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
					<svg class="relative h-14 w-14 text-white/50" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
						{#if capacidad <= 2}
							<!-- Icono anterior de 4 personas (Casa con chimenea) -->
							<path d="M3 10 12 2l9 8" />
							<path d="M5 9v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" />
							<path d="M18 5v3" />
							<path d="M9 22v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
						{:else if capacidad <= 4}
							<!-- Icono anterior de 8 personas (Lodge con tejado múltiple) -->
							<path d="M2 14v7h20v-7" />
							<path d="m2 14 5-5 5 5 5-5 5 5" />
							<path d="M7 21v-4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v4" />
							<path d="M10 12h4" />
						{:else}
							<!-- Icono de Edificio Block (8+ personas) -->
							<rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
							<path d="M9 22v-4h6v4" />
							<path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
						{/if}
					</svg>
				</div>
			</div>
		{/if}

		<!-- Contenido -->
		<div
			class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent p-4 text-white"
		>
			<h3 class="text-base font-light tracking-wide drop-shadow">{nombre}</h3>
			<p class="text-xs text-white/40 font-extralight tracking-widest uppercase">Para {capacidad} personas</p>
			<p class="mb-3 text-xs text-white/30 font-extralight">{precioPersona}</p>

			<button
				class="w-fit bg-white/5 border border-white/20 hover:bg-white/10 px-4 py-2 text-xs font-extralight text-white tracking-[0.3em] uppercase transition-all duration-300"
			>
				RESERVAR
			</button>
		</div>
	</a>
</div>
