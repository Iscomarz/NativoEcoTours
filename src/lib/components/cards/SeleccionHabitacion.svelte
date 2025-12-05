<script>
	import { onMount } from 'svelte';
	import MReserva from '$lib/objects/MReserva';
	import { reservaStore } from '$lib/stores/reservaStore.js';
	import { get } from 'svelte/store';
	import { toast } from 'sonner';
	import {goto} from '$app/navigation';
	import { getOcupacionesMultiplesHabitaciones, calcularEspaciosOcupados, isEspacioOcupado } from '$lib/core/controllers/habitaciones.service.js';

	export let habitaciones = []; // [{capacidad:number, conteo_capacidad:number, chabitacion.precioPersona?:number}]
	export let imgHabitacion;
	export let formulario; // función para manejar el submit
	export let sesionActiva = false; // si hay sesión activa, no pedir datos
	export let experiencia_id;
	export let nombreExperiencia;

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
	
	// Variables para manejar ocupaciones reales
	let espaciosOcupados = {}; // Espacios ocupados por reservas existentes
	let loadingOcupaciones = false;
	
	// Variable reactiva para forzar re-render
	let ocupacionesVersion = 0;

	onMount(async () => {
		selectedByRoom = (habitaciones ?? []).map(() => new Set());
		
		// Cargar ocupaciones si tenemos los datos necesarios
		await cargarOcupaciones();
	});
	
	// Función para cargar las ocupaciones de las habitaciones
	async function cargarOcupaciones() {
		if (habitaciones.length === 0) {
			console.log('No hay habitaciones para cargar ocupaciones');
			return;
		}
		
		try {
			loadingOcupaciones = true;
			
			// Obtener los IDs de las habitaciones
			const habitacionIds = habitaciones.map(h => {
				const id = h.id || h.id || h.id;
				return id;
			}).filter(Boolean);
			
			if (habitacionIds.length === 0) {
				console.log('❌ No se encontraron IDs válidos de habitaciones');
				return;
			}
			
			const ocupaciones = await getOcupacionesMultiplesHabitaciones(habitacionIds);
			
			const nuevosEspaciosOcupados = calcularEspaciosOcupados(habitaciones, ocupaciones);
			
			// Forzar reactividad de Svelte
			espaciosOcupados = { ...nuevosEspaciosOcupados };
			ocupacionesVersion++; // Incrementar para forzar re-render
			
			// Test: verificar si isOccupied funciona
			for (let roomIdx = 0; roomIdx < habitaciones.length; roomIdx++) {
				for (let seatIdx = 0; seatIdx < 5; seatIdx++) { // test primeros 5 espacios
					const ocupado = isEspacioOcupado(espaciosOcupados, roomIdx, seatIdx);
					if (ocupado) {
					}
				}
			}
			
		} catch (error) {
			console.error('Error al cargar ocupaciones:', error);
			toast.error('Error al cargar las ocupaciones de habitaciones');
		} finally {
			loadingOcupaciones = false;
		}
	}

	// Si cambia el número de habitaciones, ajusta estructura (sin depender de selectedCount)
	$: if (habitaciones && selectedByRoom.length !== habitaciones.length) {
		const prev = selectedByRoom;
		selectedByRoom = habitaciones.map((_, idx) => prev[idx] ?? new Set());
	}
	
	// Recargar ocupaciones cuando cambien las habitaciones
	$: if (habitaciones.length > 0) {
		cargarOcupaciones();
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

	// Función reactiva para verificar ocupación
	function isOccupied(roomIdx, seatIdx) {
		// Incluir ocupacionesVersion para forzar reactividad
		const _ = ocupacionesVersion; // Esta línea fuerza que Svelte detecte el cambio
		const ocupado = isEspacioOcupado(espaciosOcupados, roomIdx, seatIdx);
		return ocupado;
	}

	function isSelected(roomIdx, seatIdx) {
		return selectedByRoom[roomIdx]?.has(seatIdx);
	}

	function canSelect(h, roomIdx, seatIdx) {
		// Ocupado => no seleccionable
		if (isOccupied(roomIdx, seatIdx)) return false;
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
			toast.error('Por favor, completa todos los campos del formulario.');
			return;
		}

		//habitaciones
		const habitacionesSeleccionadas = [];
		selectedByRoom.forEach((set, rIdx) => {
			if (set.size > 0) {
				habitacionesSeleccionadas.push({
					idhabitacion: habitaciones[rIdx]?.id ?? null,
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
			nombreExperiencia: nombreExperiencia ?? '',

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
		{#if loadingOcupaciones}
			<span class="ml-2 text-xs text-yellow-400">Cargando ocupaciones...</span>
		{/if}
	</h3>

	<div class="grid grid-cols-2 gap-2">
		{#each habitaciones as habitacion, rIdx (habitacion.id + '-' + ocupacionesVersion)}
			<div class="relative rounded-md border border-white/10 p-2">
				<img
					src={imgHabitacion}
					alt="Foto habitación"
					class="h-32 w-full rounded-md object-cover"
				/>
				<div class="bottom-1 left-2 rounded bg-black/60 px-1 text-xs text-white/80">
					<p>Habitacion {rIdx + 1}</p>
				</div>

				<!-- Slots -->
				<div class="mt-3 flex flex-wrap gap-2">
					{#each Array(habitacion.capacidad ?? 0).fill(0) as _, i}
						<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
						<div
							role="button"
							tabindex="0"
							class={`rounded-lg p-2 transition-all duration-200 select-none
								${
									isOccupied(rIdx, i)
										? 'cursor-not-allowed bg-green-500/20 border border-green-500/50'
										: isSelected(rIdx, i)
											? 'cursor-pointer bg-blue-500/30 border border-blue-400 shadow-md'
											: selectedCount >= maxSelectable
												? 'cursor-not-allowed bg-gray-600/20 border border-gray-600/30'
												: 'cursor-pointer bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40'
								}`}
							on:click={() => toggleSeat(habitacion, rIdx, i)}
							on:keydown={(e) =>
								(e.key === 'Enter' || e.key === ' ') && toggleSeat(habitacion, rIdx, i)}
							title={isOccupied(rIdx, i)
								? 'Ocupado'
								: isSelected(rIdx, i)
									? 'Seleccionado'
									: selectedCount >= maxSelectable
										? 'Límite alcanzado'
										: 'Disponible'}
						>
							<!-- Ícono de persona -->
							<svg 
								class={`w-5 h-5 transition-colors
									${
										isOccupied(rIdx, i)
											? 'text-green-400'
											: isSelected(rIdx, i)
												? 'text-blue-200'
												: selectedCount >= maxSelectable
													? 'text-gray-500'
													: 'text-white/70'
									}`}
								fill="currentColor" 
								viewBox="0 0 20 20"
							>
								<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
							</svg>
						</div>
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
