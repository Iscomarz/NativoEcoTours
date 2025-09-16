<script>
	import habitacionPortada from '$lib/assets/habitaciones/habitacion1.png';

	export let id;
	export let nombre;
	export let capacidad;
	export let precioPersona;
	export let precioCuarto;
	export let portada;
	export let conteo;
	export let lleno;
	export let idexperiencia;
	export let slot;
    export let ruta;
</script>

<div
	class="group relative w-[280px] min-w-[280px] flex-shrink-0 snap-center overflow-hidden rounded-xl bg-black shadow-lg"
>
	<a href="/experiencia/{ruta}/habitacion/{slot}" class="block">
		<img
			src={habitacionPortada}
			alt={nombre}
			class="h-[380px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
		/>

		<!-- Contenido -->
		<div
			class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-transparent to-transparent p-4 text-white"
		>
			<h3 class="text-2xl font-bold drop-shadow-lg">{nombre}</h3>
			<p class="text-sm text-gray-200">Habitacion para {capacidad} personas</p>
			<p class="mb-3 text-xs text-gray-300">{precioPersona}</p>

			<button
				class="w-fit rounded-md bg-green-600 px-4 py-2 text-sm font-bold text-white uppercase shadow-md hover:bg-green-700"
			>
				RESERVAR
			</button>
		</div>
	</a>
</div>
