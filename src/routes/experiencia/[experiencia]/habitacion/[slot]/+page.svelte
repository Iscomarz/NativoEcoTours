<script>
	import imgHabitacion from '$lib/assets/habitaciones/habitacion2.png';
	import SeleccionHabitacion from '$lib/components/cards/SeleccionHabitacion.svelte';
	import GaleriaHabitacion from '$lib/components/galerias/GaleriaHabitacion.svelte';
	import {onMount} from 'svelte';
	import { on } from 'svelte/events';
	import { Toaster } from 'svelte-french-toast';

	export let data;

	let habitaciones = data.props.habitaciones ?? [];
	let imagenes = habitaciones[0].chabitacion.imagenes ?? [];
	let experiencia_id = habitaciones[0].chabitacion.idexperiencia ?? null;
	let nombre = '';
	let telefono = '';
	let email = '';
	let lugaresDisponibles = 0;
	let sesionActiva = false;

	// Función para manejar el submit del formulario de selección de habitación
	$: formulario = {
		nombre,
		telefono,
		email,
	};

	// Calcular lugares disponibles
	onMount(() => {
		for(const hab of habitaciones){
			lugaresDisponibles += hab.capacidad - hab.conteo_capacidad;
		}

		// Verificar si hay una sesión activa dentro de las propiedades de data
		sesionActiva = data.props.sesionActiva ?? false;

	});

</script>

<Toaster />

<GaleriaHabitacion {imagenes} titulo="Galería de la habitación" />
<div class="min-h-screen bg-[#181818] px-4 py-8">
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

			<SeleccionHabitacion {habitaciones} {imgHabitacion} {formulario} {sesionActiva} {experiencia_id} />
		</div>

		{#if !sesionActiva}
				<!-- DERECHA: FORMULARIO -->
			<div class="infoUsuario">
			<h2 class="mb-4 text-lg font-bold tracking-widest text-white">INFORMACIÓN</h2>
			<form class="flex flex-col gap-3">
				<input
					class="rounded bg-neutral-700 px-3 py-2 text-white outline-none"
					placeholder="Nombre"
					bind:value={nombre}
				/>
				<input
					class="rounded bg-neutral-700 px-3 py-2 text-white outline-none"
					placeholder="Teléfono"
					bind:value={telefono}
				/>
				<input
					class="rounded bg-neutral-700 px-3 py-2 text-white outline-none"
					placeholder="Email"
					bind:value={email}
				/>
			</form>
		</div>
		{/if}
		
	</div>
</div>
