<script>
	import imgHabitacion from '$lib/assets/habitaciones/habitacion2.png';
	import SeleccionHabitacion from '$lib/components/cards/SeleccionHabitacion.svelte';

	export let data;

	let habitaciones = data.props.habitaciones ?? [];
	let nombre = '';
	let telefono = '';
	let email = '';
</script>

<div class="min-h-screen bg-[#181818] px-4 py-8 pt-40">
	<div class="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
		<!-- IZQUIERDA: RESERVA -->
		<div>
			<div class="mb-8">
				<!-- Primera fila: nombre y precio -->
				<div class="flex items-center justify-between">
					<span class="text-md font-semibold text-white">{habitaciones[0].nombre}</span>
					<span class="text-2xl font-bold text-white">
						{habitaciones[0].precioPersona?.toLocaleString() ?? '0'}
					</span>
				</div>
				<!-- Segunda fila: lugares disponibles y por persona -->
				<div class="mt-1 flex items-center justify-between">
					<span class="text-sm font-semibold text-red-500">
						{habitaciones[0].lugaresDisponibles ?? 10} Lugares disponibles!
					</span>
					<span class="text-sm text-white/80">Por persona</span>
				</div>
			</div>

			<SeleccionHabitacion {habitaciones} {imgHabitacion} />
		</div>

		<!-- DERECHA: FORMULARIO -->
		<div>
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
	</div>
</div>
