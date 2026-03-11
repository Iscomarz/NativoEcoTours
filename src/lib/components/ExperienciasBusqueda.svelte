<script>
	import { onMount } from 'svelte';

	export let experiencias = [];

	let search = '';

	// Filtrado dinámico
	$: filtradas = experiencias
		.filter(
			(e) =>
				(e.titulo.toLowerCase().includes(search.toLowerCase()) ||
					e.ubicacion.toLowerCase().includes(search.toLowerCase()))
		)
		.sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio)) // recientes primero
		.slice(0, 6); // máximo 6

		onMount(() =>{
			console.log('🔍 Experiencias recibidas en ExperienciasBusqueda:', experiencias);
		})
</script>

<section class="text-white px-6 py-12 md:px-20">
	<!-- Barra de búsqueda y filtro -->
	<div class="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
		<input
			type="text"
			placeholder="Buscar experiencia..."
			bind:value={search}
			class="w-full bg-white/5 border border-white/10 px-4 py-2 text-xs text-white placeholder-white/20 font-extralight tracking-wide outline-none focus:ring-1 focus:ring-white/20 transition-all md:w-1/2"
		/>
	</div>

	<!-- Lista de experiencias -->
	<div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
		{#each filtradas as exp}
			<a href="/experiencia/{exp.experiencia}" class="no-underline" aria-label={`Ver ${exp.titulo}`}>
				<div class="overflow-hidden bg-white/[0.03] border border-white/10 transition-colors duration-300 hover:bg-white/[0.05]">
					{#if exp.portada && exp.portada[0]}
						<div class="h-44 overflow-hidden bg-black">
							<img src={exp.portada[0]} alt={exp.titulo} class="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
						</div>
					{/if}

					<div class="p-5">
						<h3 class="text-sm font-light text-white/80 tracking-widest line-clamp-1">{exp.titulo}</h3>
						<p class="mt-1 text-xs text-white/25 font-extralight tracking-[0.3em] uppercase">{exp.cubicacion.nombre_ubicacion}{exp.cubicacion.estado_ubicacion ? `, ${exp.cubicacion.estado_ubicacion}` : ''}</p>
						<p class="mt-3 text-xs text-white/30 font-extralight line-clamp-3 leading-relaxed">{exp.descripcion}</p>

						<div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
							<div class="text-xs text-white/20 font-extralight tracking-widest">
								<span>{new Date(exp.fecha_inicio).toLocaleDateString()}</span>
								<span class="mx-1">—</span>
								<span>{new Date(exp.fecha_fin).toLocaleDateString()}</span>
							</div>
							{#if !exp.activo}
								<span class="inline-block border border-red-400/20 px-2 py-0.5 text-[10px] font-extralight tracking-widest uppercase text-red-400/60">Inactiva</span>
							{/if}
						</div>
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>
