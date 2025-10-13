<script>
	import { onMount } from 'svelte';
	import MReserva from '$lib/objects/MReserva';
	import { reservaStore } from '$lib/stores/reservaStore.js';
	import { get } from 'svelte/store';
	import toast from 'svelte-french-toast';
	import {goto} from '$app/navigation';

	export let habitaciones = []; // [{capacidad:number, conteo_capacidad:number, chabitacion.precioPersona?:number}]
	export let imgHabitacion;
	export let formulario; // función para manejar el submit
	export let sesionActiva = false; // si hay sesión activa, no pedir datos
	export let experiencia_id;

	$: formulario = formulario ?? {};

	let reserva = new MReserva();
	let seleccion = 'grupo'; // 'grupo' | 'individual'
	let grupo = true; // estado para mostrar controles
	let cantidad = 2; // cantidad de personas en modo grupo

	$: grupo = seleccion === 'grupo';

	// Capacidad real total disponible (suma de cada (capacidad - conteo_capacidad))
	$: totalDisponible =
		habitaciones?.reduce(
			(acc, h) => acc + Math.max((h?.capacidad ?? 0) - (h?.conteo_capacidad ?? 0), 0),
			0
		) ?? 0;

	// Mantener cantidad dentro de límites en grupo, 2 como minimo y totalDisponible como máximo
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

	// conteo_capacidad total seleccionado y máximo permitido según modo
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
		return idx < (h?.conteo_capacidad ?? 0);
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
	$: personasParaPrecio = seleccion === 'individual' ? 1 : cantidad || 0;

	function mandarFormulario() {
		// Aquí puedes manejar el envío del formulario

		if (!sesionActiva && (!formulario.nombre || !formulario.telefono || !formulario.email)) {
			console.log('Formulario incompleto');
			toast.error('Por favor, completa todos los campos del formulario.', {
				style: 'border-radius: 200px; background: #333; color: #fff;'
			});
			return;
		}

		//habitaciones
		const habitacionesSeleccionadas = [];
		selectedByRoom.forEach((set, rIdx) => {
			if (set.size > 0) {
				habitacionesSeleccionadas.push({
					idhabitacion: habitaciones[rIdx]?.chabitacion?.id ?? null,
					cantidad: set.size
				});
			}
		});

		//console.log('Habitaciones seleccionadas:', habitacionesSeleccionadas);

		//llenar mreserva
		reserva = new MReserva({
			//Datos cliente
			usuario_id: sesionActiva ? (formulario.idusuario ?? null) : null,
			nombre_cliente: !sesionActiva ? (formulario.nombre ?? '') : '',
			correo_cliente: !sesionActiva ? (formulario.email ?? '') : '',
			numero_cliente: !sesionActiva ? (formulario.telefono ?? '') : '',

			//Datos experiencia
			experiencia_id: experiencia_id ?? null,
			fecha_reserva: new Date(),

			//datos grupo y pago
			grupo: seleccion === 'grupo' ? 1 : 0,
			cantidad_grupo: seleccion === 'grupo' ? cantidad : 1,
			precio_unitario: habitaciones?.[0]?.chabitacion?.precioPersona ?? 0,

			//calculo total
			total:
				(habitaciones?.[0]?.chabitacion?.precioPersona || 0) *
				(seleccion === 'grupo' ? cantidad : 1)
		});

		// Agregar las habitaciones a la reserva
		habitacionesSeleccionadas.forEach((h) => {
			reserva.agregarHabitacion(h.idhabitacion, h.cantidad);
		});

		// Si tienes un store, actualízalo
		reservaStore.set(reserva);
		//console.log('Reserva guardada en el store:', get(reservaStore));

		// Opcional: Mostrar confirmación
		toast.success('Reserva agregada correctamente');

		// Redireccionar a la página de pago o continuar el flujo
		goto('/checkout');
		}
		
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
					<p>{habitacion.conteo_capacidad}/{habitacion.capacidad}</p>
				</div>

				<!-- Slots -->
				<div class="mt-2 flex flex-wrap gap-1">
					{#each Array(habitacion.capacidad ?? 0).fill(0) as _, i}
						<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
						<p
							role="button"
							tabindex="0"
							class={`rounded px-1 text-sm select-none
								${
									isOccupied(habitacion, i)
										? 'cursor-not-allowed text-green-400 opacity-60'
										: isSelected(rIdx, i)
											? 'bg-white/10 text-white'
											: selectedCount >= maxSelectable
												? 'cursor-not-allowed text-white/30'
												: 'cursor-pointer text-white/80 hover:text-white'
								}`}
							on:click={() => toggleSeat(habitacion, rIdx, i)}
							on:keydown={(e) =>
								(e.key === 'Enter' || e.key === ' ') && toggleSeat(habitacion, rIdx, i)}
							title={isOccupied(habitacion, i)
								? 'Ocupado'
								: isSelected(rIdx, i)
									? 'Seleccionado'
									: selectedCount >= maxSelectable
										? 'Límite alcanzado'
										: 'Disponible'}
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
	on:click={() => mandarFormulario()}
	class="mt-5 w-full rounded bg-green-600 py-3 text-lg font-semibold tracking-wider text-white transition hover:bg-green-700 disabled:opacity-60"
	disabled={(seleccion === 'individual' && selectedCount < 1) ||
		(seleccion === 'grupo' && selectedCount < Math.min(cantidad, maxSelectable))}
>
	IR A PAGAR&nbsp;
	{habitaciones?.[0]?.chabitacion.precioPersona
		? (habitaciones[0].chabitacion.precioPersona * (personasParaPrecio || 0)).toLocaleString()
		: '0'}
</button>
