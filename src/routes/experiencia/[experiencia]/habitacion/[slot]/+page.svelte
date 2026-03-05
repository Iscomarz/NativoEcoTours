<script>
	import imgHabitacion from '$lib/assets/habitaciones/habitacion2.png';
	import SeleccionHabitacion from '$lib/components/cards/SeleccionHabitacion.svelte';
	import GaleriaHabitacion from '$lib/components/galerias/GaleriaHabitacion.svelte';
	import { onMount } from 'svelte';
	import { on } from 'svelte/events';

	export let data;

	let habitaciones = data.props.habitaciones ?? [];
	let imagenes = habitaciones[0].chabitacion.imagenes ?? [];
	let experiencia = data.props.experiencia ?? {};
	let detalleExperiencia = data.props.detalleExperiencia ?? {};
	let experiencia_id = habitaciones[0].chabitacion.idexperiencia ?? null;
	let nombre = '';
	let telefono = '';
	let email = '';
	let lugaresDisponibles = 0;
	let sesionActiva = false;

	let selComp;
	let canSubmit = false;
	let totalAPagar = 0;

	$: formattedTotal = (typeof totalAPagar === 'number' && !isNaN(totalAPagar))
		? totalAPagar.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
		: '';

	// Función para manejar el submit del formulario de selección de habitación
	$: formulario = {
		nombre,
		telefono,
		email
	};

	// Calcular lugares disponibles
	onMount(() => {
		for (const hab of habitaciones) {
			lugaresDisponibles += hab.capacidad - hab.conteo_capacidad;
		}

		// Verificar si hay una sesión activa dentro de las propiedades de data
		sesionActiva = data.props.sesionActiva ?? false;
	});
</script>

<!-- Encabezado minimalista -->
<div class="flex flex-row items-end justify-start pt-28 pb-4 px-6 bg-black text-white">
	<div>
		<p class="text-xs text-white/30 font-extralight tracking-[0.4em] uppercase mb-1">Selección</p>
		<h1 class="text-2xl font-extralight tracking-widest">La habitación perfecta para ti</h1>
	</div>
</div>

<GaleriaHabitacion {imagenes} />
<div class="min-h-screen bg-black px-4 py-8">
	<div class="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
		<!-- IZQUIERDA: RESERVA -->
		<div>
			<div class="mb-8">
				<!-- Primera fila: nombre y precio -->
				<div class="flex items-center justify-between">
					<span class="text-md font-semibold text-white">{habitaciones[0].chabitacion.nombre}</span>
					<span class="text-2xl font-bold text-white">
						{habitaciones[0].chabitacion.precioPersona?.toLocaleString() ?? '0'}
					</span>
				</div>
				<!-- Segunda fila: lugares disponibles y por persona -->
				<div class="mt-1 flex items-center justify-between">
					<span class="text-sm font-semibold text-red-500">
						{lugaresDisponibles} Lugares disponibles!
					</span>
					<span class="text-sm text-white/80">Por persona</span>
				</div>
			</div>

			<SeleccionHabitacion 
				bind:this={selComp}
				bind:canSubmit={canSubmit}
				bind:totalAPagar={totalAPagar}
				{habitaciones}
				{imgHabitacion}
				{formulario}
				{sesionActiva}
				{experiencia_id}
			/>
		</div>

		<!-- DERECHA: INFO Y FORMULARIO -->
		<div class="flex flex-col gap-6">
			<div class="pl-6 border-l border-white/10">
				<h2 class="mb-6 text-xl font-extralight tracking-widest text-white">{experiencia.titulo || 'Experiencia'}</h2>
				
				<!-- Ubicación -->
				{#if experiencia.cubicacion?.nombre_ubicacion}
					<div class="mb-4 flex items-start gap-3">
						<svg class="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
						</svg>
						<div>
							<p class="text-xs font-extralight text-white/30 tracking-widest uppercase mb-0.5">Ubicación</p>
							<p class="text-sm text-white/60 font-extralight">{experiencia.cubicacion.nombre_ubicacion}</p>
						</div>
					</div>
				{/if}

				<!-- Hotel Sede -->
				{#if detalleExperiencia.sede}
					<div class="mb-4 flex items-start gap-3">
						<svg class="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
						</svg>
						<div>
							<p class="text-xs font-extralight text-white/30 tracking-widest uppercase mb-0.5">Hotel Sede</p>
							<p class="text-sm text-white/60 font-extralight whitespace-pre-line">{detalleExperiencia.sede}</p>
						</div>
					</div>
				{/if}

				<!-- Qué Incluye -->
				{#if detalleExperiencia.queincluye}
					<div class="flex items-start gap-3">
						<svg class="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
						</svg>
						<div>
							<p class="text-xs font-extralight text-white/30 tracking-widest uppercase mb-0.5">Incluye</p>
							<p class="text-sm text-white/60 font-extralight whitespace-pre-line">{detalleExperiencia.queincluye}</p>
						</div>
					</div>
				{/if}
			</div>

			<!-- Formulario de información (solo si no hay sesión activa) -->
			{#if !sesionActiva}
				<div class="bg-white/5 border border-white/10 p-6">
					<p class="mb-4 text-xs font-extralight text-white/30 tracking-[0.35em] uppercase">Información de contacto</p>
					<form class="flex flex-col gap-3">
						<input class="bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-white/20 font-extralight tracking-wide outline-none focus:ring-1 focus:ring-white/20 transition-all"
							placeholder="Nombre" type="text" maxlength="40" bind:value={nombre} />
						<input class="bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-white/20 font-extralight tracking-wide outline-none focus:ring-1 focus:ring-white/20 transition-all"
							placeholder="Teléfono" type="tel" inputmode="numeric" maxlength="10" bind:value={telefono} />
						<input class="bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-white/20 font-extralight tracking-wide outline-none focus:ring-1 focus:ring-white/20 transition-all"
							placeholder="Email" type="email" maxlength="30" bind:value={email} />
					</form>
				</div>
			{/if}

			<!-- Botón de pago global: aparece debajo de todo el contenido, útil para mobile -->
			<div>
				<button
					type="button"
					on:click={() => selComp?.mandarFormulario && selComp.mandarFormulario()}
					class="w-full bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 py-4 text-xs font-extralight tracking-[0.3em] text-white uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
					aria-label="Pagar / Reservar"
					disabled={!canSubmit}
				>
					IR A PAGAR{#if formattedTotal} · {formattedTotal}{/if}
				</button>
			</div>
		</div>
	</div>
</div>
