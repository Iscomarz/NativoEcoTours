<script>
	import imgHabitacion from '$lib/assets/habitaciones/habitacion2.png';
	export let data;

	let habitacion = data.props.habitacion ?? {};
	let seleccion = 'grupo'; // o "individual"
	let cantidad = 2;
	let nombre = '';
	let telefono = '';
	let email = '';

	// Puedes agregar lógica para el formulario y la selección de tipo/cantidad
	function incrementar() {
		cantidad++;
	}
	function decrementar() {
		if (cantidad > 1) cantidad--;
	}
</script>

<div class="min-h-screen bg-[#181818] px-4 py-8 pt-40">
	<div class="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
		<!-- IZQUIERDA: RESERVA -->
		<div>
			<div class="mb-8">
    <!-- Primera fila: nombre y precio -->
    <div class="flex items-center justify-between">
        <span class="text-md text-white font-semibold">{habitacion.nombre}</span>
        <span class="text-2xl font-bold text-white">
            {habitacion.precioPersona?.toLocaleString() ?? '0'}
        </span>
    </div>
    <!-- Segunda fila: lugares disponibles y por persona -->
    <div class="flex items-center justify-between mt-1">
        <span class="text-sm font-semibold text-red-500">
            {habitacion.lugaresDisponibles ?? 10} Lugares disponibles!
        </span>
        <span class="text-sm text-white/80">Por persona</span>
    </div>
</div>

			<div class="mb-4 flex items-center gap-4">
				<label class="flex items-center gap-2 text-white">
					<input
						type="checkbox"
						bind:group={seleccion}
						value="individual"
						class="accent-white"
						checked={seleccion === 'individual'}
						on:change={() => (seleccion = 'individual')}
					/>
					Individual
				</label>
				<label class="flex items-center gap-2 text-white">
					<input
						type="checkbox"
						bind:group={seleccion}
						value="grupo"
						class="accent-green-600"
						checked={seleccion === 'grupo'}
						on:change={() => (seleccion = 'grupo')}
					/>
					<span class="text-green-400">Grupo</span>
				</label>
				<div class="ml-5 flex items-center">
					<button class="rounded-l bg-neutral-700 px-2 text-white" on:click={decrementar}>-</button>
					<span class="bg-neutral-800 px-4 py-1 text-white">{cantidad}</span>
					<button class="rounded-r bg-neutral-700 px-2 text-white" on:click={incrementar}>+</button>
				</div>
			</div>

			<div class="mb-3">
				<h3 class="mb-1 text-sm font-bold text-white">
					HABITACIONES {habitacion.capacidad ?? 0} PERSONAS
				</h3>
				<div class="grid grid-cols-3 gap-2">
					{#each habitacion.imagenes ?? [] as img, i}
						<div class="relative">
							<img
								src={imgHabitacion}
								alt="Foto habitación"
								class="h-20 w-full rounded-md object-cover"
							/>
							<span class="absolute bottom-1 left-2 rounded bg-black/60 px-1 text-xs text-white/80"
								>{i + 1}/{habitacion.capacidad}</span
							>
						</div>
					{/each}
				</div>
			</div>
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
				<button
					type="submit"
					class="mt-5 rounded bg-green-600 py-3 text-lg font-semibold tracking-wider text-white transition hover:bg-green-700"
				>
					IR A PAGAR&nbsp;
					{habitacion.precioPersona ? (habitacion.precioPersona * cantidad).toLocaleString() : '0'}
				</button>
			</form>
		</div>
	</div>
</div>
