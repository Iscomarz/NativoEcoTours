<script>
	import { onMount } from 'svelte';

	export let habitaciones = []; // [{capacidad:number, conteo:number, precioPersona?:number}]
	export let imgHabitacion;

	let seleccion = 'grupo'; // 'grupo' | 'individual'
	let grupo = true;
	let cantidad = 2;

	$: grupo = seleccion === 'grupo';

	// Capacidad real total disponible (suma de cada (capacidad - conteo))
	$: totalDisponible =
		habitaciones?.reduce(
			(acc, h) => acc + Math.max((h?.capacidad ?? 0) - (h?.conteo ?? 0), 0),
			0
		) ?? 0;

	// Mantener cantidad dentro de límites sin tocar la selección (evita ciclos)
	$: if (grupo && cantidad < 2) cantidad = 2;
	$: if (grupo && cantidad > totalDisponible) cantidad = totalDisponible;

	// Selecciones por habitación: arreglo de Sets con índices seleccionados
	let selectedByRoom = [];

	onMount(() => {
		selectedByRoom = (habitaciones ?? []).map(() => new Set());
	});

	// Si cambia el número de habitaciones, ajusta estructura (sin depender de selectedCount)
	$: if (habitaciones && selectedByRoom.length !== habitaciones.length) {
		const prev = selectedByRoom;
		selectedByRoom = habitaciones.map((_, idx) => prev[idx] ?? new Set());
	}

	// Conteo total seleccionado y máximo permitido según modo
	$: selectedCount = selectedByRoom.reduce((acc, s) => acc + s.size, 0);
	$: maxSelectable = seleccion === 'individual' ? 1 : cantidad;

	// Utilidad para recortar selección a N sin usar reactivas
	function pruneSelectionTo(limit) {
		let remaining = Math.max(0, limit);
		selectedByRoom = selectedByRoom.map((set) => {
			if (remaining <= 0) return new Set();
			const entries = Array.from(set);
			if (entries.length <= remaining) {
				remaining -= entries.length;
				return new Set(entries);
			} else {
				const keep = new Set(entries.slice(0, remaining));
				remaining = 0;
				return keep;
			}
		});
	}

	// Cambiar modo sin crear ciclos: podar aquí si hace falta
	function setSeleccion(value) {
		seleccion = value;
		if (value === 'individual' && selectedCount > 1) {
			pruneSelectionTo(1);
		}
		if (value === 'grupo' && selectedCount > cantidad) {
			pruneSelectionTo(cantidad);
		}
	}

	function setCantidad(newVal) {
		const min = 2;
		const max = Math.max(0, totalDisponible);
		newVal = Math.min(Math.max(newVal, min), max);
		// Si baja por debajo de lo seleccionado, podar aquí
		if (newVal < cantidad && selectedCount > newVal) {
			pruneSelectionTo(newVal);
		}
		cantidad = newVal;
	}

	function incrementar() {
		if (!grupo) return;
		setCantidad(cantidad + 1);
	}

	function decrementar() {
		if (!grupo) return;
		setCantidad(cantidad - 1);
	}

	function isOccupied(h, idx) {
		return idx < (h?.conteo ?? 0);
	}

	function isSelected(roomIdx, seatIdx) {
		return selectedByRoom[roomIdx]?.has(seatIdx);
	}

	function canSelect(h, roomIdx, seatIdx) {
		// Ocupado => no seleccionable
		if (isOccupied(h, seatIdx)) return false;
		// Si ya está seleccionado, puedes deseleccionar
		if (isSelected(roomIdx, seatIdx)) return true;
		// Si ya llegaste al máximo permitido, no permitir más
		if (selectedCount >= maxSelectable) return false;
		return true;
	}

	function toggleSeat(h, roomIdx, seatIdx) {
		if (!canSelect(h, roomIdx, seatIdx)) return;

		const set = selectedByRoom[roomIdx] ?? new Set();
		if (set.has(seatIdx)) {
			set.delete(seatIdx);
		} else {
			// Solo agrega si no excede el máximo
			if (selectedCount < maxSelectable) {
				set.add(seatIdx);
			}
		}
		// Forzar reactividad
		selectedByRoom[roomIdx] = new Set(set);
		selectedByRoom = [...selectedByRoom];
	}

	// Personas que se cobrarán según modo
	$: personasParaPrecio = seleccion === 'individual' ? 1 : (cantidad || 0);
</script>

<div class="mb-4 flex items-center gap-4">
	<label class="flex items-center gap-2 text-white">
		<input
			type="radio"
			name="tipo"
			value="individual"
			class="accent-white"
			checked={seleccion === 'individual'}
			on:change={() => setSeleccion('individual')}
		/>
		Individual
	</label>
	<label class="flex items-center gap-2 text-white">
		<input
			type="radio"
			name="tipo"
			value="grupo"
			class="accent-green-600"
			checked={seleccion === 'grupo'}
			on:change={() => setSeleccion('grupo')}
		/>
		<span class="text-green-400">Grupo</span>
	</label>

	{#if grupo}
		<div class="ml-5 flex items-center">
			<button
				class="rounded-l bg-neutral-700 px-2 text-white disabled:opacity-50"
				on:click={decrementar}
				disabled={cantidad <= 2}
				type="button"
			>
				-
			</button>
			<span class="bg-neutral-800 px-4 py-1 text-white">{cantidad}</span>
			<button
				class="rounded-r bg-neutral-700 px-2 text-white disabled:opacity-50"
				on:click={incrementar}
				disabled={cantidad >= totalDisponible}
				type="button"
			>
				+
			</button>
			<span class="ml-3 text-xs text-white/60">
				Capacidad real total: {totalDisponible}
			</span>
		</div>
	{/if}
</div>

<div class="mb-3">
	<h3 class="mb-1 text-sm font-bold text-white">
		HABITACIONES {habitaciones?.[0]?.capacidad ?? 0} PERSONAS
	</h3>

	<div class="grid grid-cols-3 gap-2">
		{#each habitaciones as habitacion, rIdx}
			<div class="relative rounded-md border border-white/10 p-2">
				<img
					src={imgHabitacion}
					alt="Foto habitación"
					class="h-20 w-full rounded-md object-cover"
				/>
				<div class="bottom-1 left-2 rounded bg-black/60 px-1 text-xs text-white/80">
                    <p>Habitacion {rIdx + 1}</p>
                    <p>{habitacion.conteo}/{habitacion.capacidad}</p>
				</div>

				<!-- Slots -->
				<div class="mt-2 flex flex-wrap gap-1">
					{#each Array(habitacion.capacidad ?? 0).fill(0) as _, i}
						<p
							role="button"
							tabindex="0"
							class={`text-sm select-none rounded px-1
								${isOccupied(habitacion, i)
									? 'text-green-400 opacity-60 cursor-not-allowed'
									: isSelected(rIdx, i)
										? 'text-white bg-white/10'
										: (selectedCount >= maxSelectable
											? 'text-white/30 cursor-not-allowed'
											: 'text-white/80 hover:text-white cursor-pointer')}`}
							on:click={() => toggleSeat(habitacion, rIdx, i)}
							on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSeat(habitacion, rIdx, i)}
							title={isOccupied(habitacion, i)
								? 'Ocupado'
								: isSelected(rIdx, i)
									? 'Seleccionado'
									: (selectedCount >= maxSelectable ? 'Límite alcanzado' : 'Disponible')}
						>
							•
						</p>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<button
	type="submit"
	class="mt-5 rounded bg-green-600 py-3 text-lg font-semibold tracking-wider text-white transition hover:bg-green-700 disabled:opacity-60"
	disabled={(seleccion === 'individual' && selectedCount < 1) || (seleccion === 'grupo' && selectedCount < Math.min(cantidad, maxSelectable))}
>
	IR A PAGAR&nbsp;
	{habitaciones?.[0]?.precioPersona
		? (habitaciones[0].precioPersona * (personasParaPrecio || 0)).toLocaleString()
		: '0'}
</button>