<script>
	import { fade, fly } from 'svelte/transition';
	import { toast, Toaster } from 'svelte-sonner';
	import { enhance } from '$app/forms';

	export let data;
	export let form;

	let { user_profile, session } = data;
	$: ({ user_profile, session } = data);

	let activeTab = 'info';

	const tabs = [
		{ id: 'info', label: 'Info. del Usuario', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
		{ id: 'favoritos', label: 'Favoritos', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
		{ id: 'reservas', label: 'Mis Reservas', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
		{ id: 'notificaciones', label: 'Notificaciones', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0' }
	];
	// Disparar toast (ahora se maneja dentro de use:enhance en el form)
</script>

<Toaster position="bottom-right" richColors toastOptions={{
	style: 'background: #0A0A0A; border: 1px solid rgba(255,255,255,0.1); color: white; font-family: inherit;'
}} />

<div class="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-6 md:px-12 xl:px-24">

	<div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-16">
		
		<!-- Sidebar -->
		<aside class="w-full md:w-64 lg:w-72 flex-shrink-0">
			<div class="mb-12">
				<p class="text-[10px] text-white/30 tracking-[0.4em] uppercase mb-1">Tu Espacio</p>
				<h1 class="text-2xl font-extralight tracking-widest uppercase">Perfil de Usuario</h1>
			</div>

			<nav class="space-y-1">
				{#each tabs as tab}
					<button
						on:click={() => activeTab = tab.id}
						class="w-full flex items-center gap-4 px-4 py-4 rounded-sm transition-all duration-300 group {activeTab === tab.id ? 'bg-white/5 text-white border-r-2 border-green-500' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.02]'}"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="transition-colors {activeTab === tab.id ? 'text-green-400' : 'text-current'}">
							<path d={tab.icon}></path>
						</svg>
						<span class="text-xs font-light tracking-[0.2em] uppercase">{tab.label}</span>
					</button>
				{/each}
			</nav>

			<div class="mt-12 pt-12 border-t border-white/5">
				<form method="POST" action="/login?/logout">
					<button type="submit" class="flex items-center gap-4 px-4 py-2 text-red-400/60 hover:text-red-400 transition-colors group">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
						<span class="text-xs font-light tracking-[0.2em] uppercase">Cerrar Sesión</span>
					</button>
				</form>
			</div>
		</aside>

		<!-- Content Area -->
		<main class="flex-1 min-w-0">
			{#if activeTab === 'info'}
				<div in:fade={{ duration: 300 }}>
					<!-- Header Profile -->
					<div class="flex flex-col sm:flex-row items-center gap-8 mb-16 p-8 bg-white/[0.02] border border-white/5 rounded-sm">
						<div class="relative group">
							<div class="w-32 h-32 rounded-full border border-white/10 overflow-hidden bg-white/5 transition-all group-hover:border-green-400/40">
								{#if user_profile?.image_perfil}
									<img src={user_profile.image_perfil} alt="Perfil" class="w-full h-full object-cover" />
								{:else}
									<div class="w-full h-full flex items-center justify-center text-white/10">
										<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
									</div>
								{/if}
							</div>
							<button class="absolute bottom-0 right-0 p-2 bg-green-500 rounded-full border-4 border-[#0a0a0a] text-black hover:scale-110 transition-transform shadow-lg">
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
							</button>
						</div>

						<div class="text-center sm:text-left">
							<h2 class="text-3xl font-extralight tracking-widest mb-1">{user_profile?.nombre || 'Nombre'} {user_profile?.apellido || 'Apellido'}</h2>
							<p class="text-xs text-white/40 tracking-[0.3em] uppercase mb-4">{user_profile?.estado || 'Rumbo a la aventura'}, {user_profile?.pais || ''}</p>
							<button class="text-[10px] text-green-400 font-medium tracking-widest uppercase hover:underline">Cambiar contraseña</button>
						</div>
					</div>

					<!-- Form -->
					<form 
						method="POST" 
						action="?/update" 
						class="space-y-12"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'success') {
									toast.success('Perfil actualizado correctamente', {
										description: 'Tus datos han sido guardados en Nativo Eco Tours.',
										duration: 4000
									});
								} else if (result.type === 'failure') {
									toast.error('Error al actualizar', {
										description: result.data?.error || 'Ocurrió un error inesperado',
										duration: 5000
									});
								}
							};
						}}
					>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
							<div class="space-y-3">
								<label for="nombre" class="block text-[10px] text-white/40 font-medium tracking-[0.4em] uppercase">Nombre</label>
								<input 
									type="text" 
									id="nombre" 
									name="nombre" 
									value={user_profile?.nombre || ''}
									class="w-full bg-white/[0.03] border border-white/10 px-4 py-4 text-sm font-light tracking-wide focus:border-green-400/50 focus:outline-none transition-colors"
								/>
							</div>
							<div class="space-y-3">
								<label for="apellido" class="block text-[10px] text-white/40 font-medium tracking-[0.4em] uppercase">Apellidos</label>
								<input 
									type="text" 
									id="apellido" 
									name="apellido" 
									value={user_profile?.apellido || ''}
									class="w-full bg-white/[0.03] border border-white/10 px-4 py-4 text-sm font-light tracking-wide focus:border-green-400/50 focus:outline-none transition-colors"
								/>
							</div>
							<div class="space-y-3">
								<label class="block text-[10px] text-white/40 font-medium tracking-[0.4em] uppercase">Correo</label>
								<input 
									type="email" 
									disabled
									value={session?.user?.email || ''}
									class="w-full bg-white/[0.01] border border-white/5 px-4 py-4 text-sm font-light tracking-wide text-white/20 cursor-not-allowed"
								/>
							</div>
							<div class="space-y-3">
								<label for="telefono" class="block text-[10px] text-white/40 font-medium tracking-[0.4em] uppercase">Teléfono</label>
								<input 
									type="text" 
									id="telefono" 
									name="telefono" 
									value={user_profile?.telefono || ''}
									class="w-full bg-white/[0.03] border border-white/10 px-4 py-4 text-sm font-light tracking-wide focus:border-green-400/50 focus:outline-none transition-colors"
								/>
							</div>
							<div class="space-y-3">
								<label for="pais" class="block text-[10px] text-white/40 font-medium tracking-[0.4em] uppercase">País</label>
								<input 
									type="text" 
									id="pais" 
									name="pais" 
									value={user_profile?.pais || ''}
									class="w-full bg-white/[0.03] border border-white/10 px-4 py-4 text-sm font-light tracking-wide focus:border-green-400/50 focus:outline-none transition-colors"
								/>
							</div>
							<div class="space-y-3">
								<label for="estado" class="block text-[10px] text-white/40 font-medium tracking-[0.4em] uppercase">Estado</label>
								<input 
									type="text" 
									id="estado" 
									name="estado" 
									value={user_profile?.estado || ''}
									class="w-full bg-white/[0.03] border border-white/10 px-4 py-4 text-sm font-light tracking-wide focus:border-green-400/50 focus:outline-none transition-colors"
								/>
							</div>
						</div>

						<div class="flex flex-col sm:flex-row items-center gap-6 pt-6">
							<button 
								type="submit"
								class="w-full sm:w-auto px-12 py-4 bg-green-500 text-black font-medium tracking-[0.3em] uppercase text-xs hover:bg-green-400 transition-colors shadow-lg shadow-green-500/10"
							>
								Guardar cambios
							</button>
						</div>
					</form>
				</div>
			{:else}
				<div class="h-[60vh] flex flex-col items-center justify-center text-center p-12 bg-white/[0.01] border border-dashed border-white/10 rounded-sm" in:fade>
					<div class="p-4 bg-white/5 rounded-full mb-6 text-white/20">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
							<path d="M12 2v20M2 12h20"></path>
						</svg>
					</div>
					<h3 class="text-lg font-extralight tracking-widest uppercase mb-2">Próximamente</h3>
					<p class="text-xs text-white/30 font-light tracking-wide max-w-xs">Estamos trabajando para habilitar esta sección muy pronto.</p>
				</div>
			{/if}
		</main>

	</div>
</div>
