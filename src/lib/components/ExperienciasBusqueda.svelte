<script>
	import { onMount } from 'svelte';

	export let experiencias = [];

	let search = '';
	let mostrarActivos = true;

	// Filtrado dinámico
	$: filtradas = experiencias
		.filter(
			(e) =>
				(mostrarActivos ? e.activo : true) &&
				(e.titulo.toLowerCase().includes(search.toLowerCase()) ||
					e.ubicacion.toLowerCase().includes(search.toLowerCase()))
		)
		.sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio)) // recientes primero
		.slice(0, 6); // máximo 6
</script>

<section class="bg-gray-50 px-6 py-12 md:px-20">
	<!-- Barra de búsqueda y filtro -->
	<div class="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
		<input
			type="text"
			placeholder="Buscar experiencia..."
			bind:value={search}
			class="w-full rounded-full border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 md:w-1/2"
		/>

		<label class="flex items-center gap-2 text-sm text-gray-700">
			<input
				type="checkbox"
				bind:checked={mostrarActivos}
				class="rounded text-green-500 focus:ring-green-500"
			/>
			Solo experiencias activas
		</label>
	</div>

	<!-- Lista de experiencias -->
	<div class="grid gap-6 md:grid-cols-2">
		{#each filtradas as exp}
			<a href="/experiencia/{exp.experiencia}" class="no-underline">
				<div
					class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition hover:shadow-xl"
				>
					<div class="p-6">
						<h3 class="text-xl font-bold text-gray-900">{exp.titulo}</h3>
						<p class="mb-2 text-sm text-gray-600">{exp.cubicacion.nombre_ubicacion}, {exp.cubicacion.estado_ubicacion}</p>
						<p class="mb-4 text-gray-700">{exp.descripcion}</p>
						<div class="text-sm text-gray-500">
							<span>{new Date(exp.fecha_inicio).toLocaleDateString()}</span> -
							<span>{new Date(exp.fecha_fin).toLocaleDateString()}</span>
						</div>
						{#if !exp.activo}
							<span class="mt-2 inline-block rounded-full bg-red-100 px-2 py-1 text-xs text-red-600"
								>Inactiva</span
							>
						{/if}
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>
