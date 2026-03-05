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
