<script>
	import { fade, fly } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { supabase } from '$lib/core/supabase/client';

	export let data;
	export let form;

	let { user_profile, session, favoritos } = data;
	$: ({ user_profile, session, favoritos } = data);

	async function quitarFavorito(id) {
		try {
			const { error } = await supabase
				.from('rfavoritoubicacion')
				.delete()
				.eq('id', id);

			if (error) throw error;
			
			// Actualizar localmente
			data.favoritos = data.favoritos.filter(f => f.id !== id);
			toast.success('Aviso eliminado correctamente.');
		} catch (e) {
			console.error(e);
			toast.error('No se pudo eliminar el aviso.');
		}
	}

	async function actualizarNotificacion(id, estado) {
		try {
			const { error } = await supabase
				.from('rfavoritoubicacion')
				.update({ notificar: estado })
				.eq('id', id);

			if (error) throw error;
			
			toast.success(estado ? 'Notificaciones activadas' : 'Notificaciones pausadas');
		} catch (e) {
			console.error(e);
			toast.error('No se pudo actualizar la preferencia.');
			// Revertimos el estado local si falla la base de datos
			const fav = data.favoritos.find(f => f.id === id);
			if (fav) fav.notificar = !estado;
			data.favoritos = data.favoritos; // Disparar reactividad
		}
	}

	function formatearNombreParaURL(nombre) {
		if (!nombre) return '';
		return nombre
			.replace(/\s+/g, '-')
			.replace(/[áàäâ]/g, 'a')
			.replace(/[éèëê]/g, 'e')
			.replace(/[íìïî]/g, 'i')
			.replace(/[úùüû]/g, 'u')
			.replace(/ñ/g, 'n');
	}

	let showPasswordForm = false;
	let newPassword = '';
	let confirmPassword = '';
	let loadingPassword = false;
	let infoSubTab = 'profile'; // 'profile' o 'security'
	let showPassword = false;

	$: hasUppercase = /[A-Z]/.test(newPassword);
	$: hasNumber = /[0-9]/.test(newPassword);
	$: hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
	$: isLengthValid = newPassword.length >= 6;
	
	$: passwordStrength = (() => {
		if (!newPassword) return 0;
		let score = 0;
		if (isLengthValid) score += 25;
		if (hasUppercase) score += 25;
		if (hasNumber) score += 25;
		if (hasSpecial) score += 25;
		return score;
	})();

	$: strengthColor = passwordStrength === 0 ? 'bg-white/10' :
					   passwordStrength <= 25 ? 'bg-red-500' :
					   passwordStrength <= 50 ? 'bg-orange-500' :
					   passwordStrength <= 75 ? 'bg-yellow-500' : 'bg-green-500';

	async function cambiarPassword() {
		if (newPassword !== confirmPassword) {
			toast.error('Las contraseñas no coinciden');
			return;
		}

		if (!isLengthValid || !hasUppercase || !hasNumber) {
			toast.error('La contraseña no cumple con los requisitos mínimos');
			return;
		}

		loadingPassword = true;
		try {
			const { error } = await supabase.auth.updateUser({
				password: newPassword
			});

			if (error) throw error;

			toast.success('Contraseña actualizada correctamente');
			showPasswordForm = false;
			newPassword = '';
			confirmPassword = '';
		} catch (e) {
			console.error(e);
			toast.error('Error al actualizar la contraseña: ' + e.message);
		} finally {
			loadingPassword = false;
		}
	}

	let activeTab = 'info';
	let expandedReservaId = null;

	// Paginación y Filtros
	let showPastReservations = false;
	let currentPage = 1;
	const itemsPerPage = 3;

	$: filteredReservas = data.reservas.filter(reserva => {
		const fechaFin = reserva.cexperiencia?.fecha_fin ? new Date(reserva.cexperiencia.fecha_fin) : 
						 reserva.cexperiencia?.fecha_inicio ? new Date(reserva.cexperiencia.fecha_inicio) : new Date();
		const isPast = fechaFin < new Date();
		return showPastReservations ? true : !isPast;
	});

	$: totalPages = Math.ceil(filteredReservas.length / itemsPerPage);
	$: paginatedReservas = filteredReservas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	$: if (showPastReservations || activeTab) {
		currentPage = 1;
	}

	function toggleReserva(id) {
		expandedReservaId = expandedReservaId === id ? null : id;
	}

	const tabs = [
		{ id: 'info', label: 'Info. del Usuario', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
		{ id: 'favoritos', label: 'Favoritos', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
		{ id: 'reservas', label: 'Mis Reservas', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
		// { id: 'notificaciones', label: 'Notificaciones', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0' }
	];
	// Disparar toast (ahora se maneja dentro de use:enhance en el form)
</script>


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
							<button 
								on:click={() => infoSubTab = infoSubTab === 'profile' ? 'security' : 'profile'}
								class="text-[10px] text-green-400 font-medium tracking-widest uppercase hover:underline"
							>
								{infoSubTab === 'profile' ? 'Seguridad de la cuenta' : 'Volver al Perfil'}
							</button>
						</div>
					</div>

					{#if infoSubTab === 'profile'}
						<div in:fade>
							<!-- Form -->
							<form 
								method="POST" 
								action="?/update" 
								class="space-y-12"
								use:enhance={() => {
									return async ({ result, update }) => {
										if (result.type === 'success') {
											toast.success('Perfil actualizado correctamente', {
												description: 'Tus datos han sido guardados en Nativo Eco Tours.',
												duration: 4000
											});
											await update({ reset: false });
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
											type="tel" 
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
					{:else if infoSubTab === 'security'}
						<div in:fade class="max-w-xl">
							<div class="flex items-center gap-4 mb-8">
								<button 
									on:click={() => infoSubTab = 'profile'}
									class="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
								</button>
								<div>
									<h3 class="text-xl font-extralight tracking-widest uppercase">Seguridad de la cuenta</h3>
									<p class="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Actualiza tus credenciales de acceso</p>
								</div>
							</div>

							<div class="space-y-8 bg-white/[0.02] border border-white/5 p-8 rounded-sm">
								<div class="grid grid-cols-1 gap-6">
									<div class="space-y-3">
										<label class="block text-[10px] text-white/40 font-medium tracking-[0.4em] uppercase">Nueva Contraseña</label>
										<div class="relative">
											<input 
												type={showPassword ? "text" : "password"} 
												bind:value={newPassword}
												placeholder="Mínimo 6 caracteres"
												class="w-full bg-white/[0.03] border border-white/10 px-4 py-4 pr-12 text-sm font-light tracking-wide focus:border-green-400/50 focus:outline-none transition-colors text-white"
											/>
											<button 
												type="button"
												on:click={() => showPassword = !showPassword}
												class="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
											>
												{#if showPassword}
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
												{:else}
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
												{/if}
											</button>
										</div>
										<!-- Medidor de fuerza y requisitos -->
										{#if newPassword.length > 0}
											<div class="space-y-4 mt-4" in:fade>
												<div class="w-full h-1 bg-white/10 rounded-full overflow-hidden">
													<div class="h-full {strengthColor} transition-all duration-300" style="width: {passwordStrength}%"></div>
												</div>
												<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
													<div class="flex items-center gap-2 text-[9px] uppercase tracking-widest {isLengthValid ? 'text-green-400' : 'text-white/30'} transition-colors">
														<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
														<span>Mínimo 6 caracteres</span>
													</div>
													<div class="flex items-center gap-2 text-[9px] uppercase tracking-widest {hasUppercase ? 'text-green-400' : 'text-white/30'} transition-colors">
														<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
														<span>1 Mayúscula</span>
													</div>
													<div class="flex items-center gap-2 text-[9px] uppercase tracking-widest {hasNumber ? 'text-green-400' : 'text-white/30'} transition-colors">
														<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
														<span>1 Número</span>
													</div>
													<div class="flex items-center gap-2 text-[9px] uppercase tracking-widest {hasSpecial ? 'text-green-400' : 'text-white/30'} transition-colors">
														<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
														<span>1 Carácter Especial (opcional)</span>
													</div>
												</div>
											</div>
										{/if}
									</div>
									<div class="space-y-3">
										<label class="block text-[10px] text-white/40 font-medium tracking-[0.4em] uppercase">Confirmar Nueva Contraseña</label>
										<div class="relative">
											<input 
												type={showPassword ? "text" : "password"} 
												bind:value={confirmPassword}
												placeholder="Repite la contraseña"
												class="w-full bg-white/[0.03] border border-white/10 px-4 py-4 pr-12 text-sm font-light tracking-wide focus:border-green-400/50 focus:outline-none transition-colors text-white"
											/>
										</div>
									</div>
								</div>
								
								<div class="flex items-center gap-6">
									<button 
										on:click={cambiarPassword}
										disabled={loadingPassword}
										class="px-12 py-4 bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white/20 transition-all disabled:opacity-50"
									>
										{loadingPassword ? 'Actualizando...' : 'Confirmar Cambio'}
									</button>
									<button 
										on:click={() => infoSubTab = 'profile'}
										class="text-[10px] text-white/20 uppercase tracking-[0.2em] hover:text-white transition-colors"
									>
										Cancelar
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{:else if activeTab === 'reservas'}
				<div in:fade={{ duration: 300 }} class="space-y-6">
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
						<div>
							<h3 class="text-xl font-extralight tracking-widest uppercase">Mis Reservas</h3>
							<p class="text-xs text-white/30 font-light tracking-wide mt-1">Sigue el estado de tus aventuras y pagos pendientes.</p>
						</div>
						
						<label class="flex items-center gap-3 cursor-pointer group">
							<span class="text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">Ver viajes pasados</span>
							<div class="relative">
								<input type="checkbox" bind:checked={showPastReservations} class="sr-only peer" />
								<div class="w-9 h-5 bg-white/5 border border-white/10 rounded-full peer peer-checked:bg-green-500/20 peer-checked:border-green-500/40 transition-all duration-300"></div>
								<div class="absolute left-1 top-1 w-3 h-3 bg-white/20 rounded-full peer-checked:translate-x-4 peer-checked:bg-green-400 transition-all duration-300"></div>
							</div>
						</label>
					</div>

					{#if paginatedReservas.length > 0}
						<div class="grid grid-cols-1 gap-6">
							{#each paginatedReservas as reserva}
								{@const pagado = reserva.dplazo?.filter(p => p.pagado).reduce((acc, p) => acc + Number(p.monto || 0), 0) || (reserva.fecha_liquidacion ? reserva.total : 0)}
								{@const faltante = Math.max(0, (reserva.total || 0) - pagado)}
								{@const habitacionesNombres = Array.from(new Set(reserva.rhabitacionreserva?.map(rh => rh.dhabitacion?.chabitacion?.nombre).filter(Boolean))).join(', ') || 'Habitación'}
								
								<button 
									class="w-full text-left bg-white/[0.02] border border-white/5 rounded-sm p-6 hover:bg-white/[0.04] transition-all duration-300 group"
									on:click={() => toggleReserva(reserva.id)}
								>
									<div class="flex flex-col md:flex-row justify-between gap-6">
										<!-- Info Reserva -->
										<div class="flex-1">
											<div class="flex items-center gap-3 mb-2">
												<span class="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] uppercase tracking-widest">
													Reserva #{reserva.id.toString().slice(-6)}
												</span>
												{#if reserva.pago_a_plazos}
													<span class="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase tracking-widest">
														A Plazos (20%)
													</span>
												{/if}
												<div class="ml-auto md:hidden text-white/20 transition-transform duration-300 {expandedReservaId === reserva.id ? 'rotate-180' : ''}">
													<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
												</div>
											</div>
											<h4 class="text-lg font-light tracking-widest text-white mb-1 uppercase">
												{reserva.cexperiencia?.titulo || 'Experiencia'}
											</h4>
											<p class="text-xs text-white/40 font-extralight tracking-wide mb-2">
												Realizada el {new Date(reserva.fecha_reserva).toLocaleDateString()}
											</p>
											<div class="flex flex-wrap items-center gap-2">
												<div class="flex items-center gap-2 text-white/60 bg-white/5 w-fit px-2 py-1 rounded-sm border border-white/5">
													<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
													<span class="text-[10px] uppercase tracking-[0.1em] font-light">
														{reserva.cantidad_grupo} {reserva.cantidad_grupo === 1 ? 'Viajero' : 'Viajeros'}
													</span>
												</div>
												<div class="flex items-center gap-2 text-white/60 bg-white/5 w-fit px-2 py-1 rounded-sm border border-white/5">
													<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
													<span class="text-[10px] uppercase tracking-[0.1em] font-light">
														{habitacionesNombres}
													</span>
												</div>
											</div>
										</div>

										<!-- Estado Financiero -->
										<div class="flex flex-col md:text-right">
											<div class="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1">Total Reserva</div>
											<div class="text-xl font-extralight text-white tracking-widest mb-4">
												{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(reserva.total)}
											</div>
											
											<div class="grid grid-cols-2 md:block gap-4">
												<div class="mb-2">
													<p class="text-[9px] text-green-400/60 uppercase tracking-widest mb-0.5">Pagado</p>
													<p class="text-sm font-light text-green-400">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(pagado)}</p>
												</div>
												{#if faltante > 0}
													<div>
														<p class="text-[9px] text-red-400/60 uppercase tracking-widest mb-0.5">Pendiente</p>
														<p class="text-sm font-light text-red-400">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(faltante)}</p>
													</div>
												{/if}
											</div>
										</div>
									</div>

									<!-- Barra de Progreso y Aviso -->
									<div class="mt-8 pt-6 border-t border-white/5">
										<div class="w-full bg-white/5 h-1 rounded-full mb-3 overflow-hidden">
											<div class="bg-green-500 h-full transition-all duration-1000" style="width: {(pagado / reserva.total) * 100}%"></div>
										</div>
										
										<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
											{#if faltante > 0}
												<div class="flex items-start gap-2 text-red-400/60">
													<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
													<p class="text-[10px] uppercase tracking-widest leading-relaxed">
														Debes liquidar el total antes de la fecha del evento.
													</p>
												</div>
												<a href="/perfil/pagar/{reserva.id}" class="px-6 py-2 bg-white/5 border border-white/10 text-white/60 text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all text-center" on:click|stopPropagation>
													Pagar Plazo
												</a>
											{:else}
												<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
													<div class="flex items-center gap-2 text-green-400/60">
														<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
														<p class="text-[10px] uppercase tracking-widest text-nowrap">Reserva Liquidada Completamente</p>
													</div>
													
													{#if (Array.isArray(reserva.cexperiencia?.dexperiencia) ? reserva.cexperiencia.dexperiencia[0]?.grupo_whatsapp : reserva.cexperiencia?.dexperiencia?.grupo_whatsapp)}
														<a 
															href={Array.isArray(reserva.cexperiencia?.dexperiencia) ? reserva.cexperiencia.dexperiencia[0].grupo_whatsapp : reserva.cexperiencia.dexperiencia.grupo_whatsapp} 
															target="_blank" 
															rel="noopener noreferrer"
															class="ml-auto px-4 py-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[9px] uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all flex items-center gap-2"
															on:click|stopPropagation
														>
															<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
															Grupo WhatsApp
														</a>
													{/if}
												</div>
											{/if}
										</div>
									</div>

									<!-- Detalles de Abonos (Acordeón) -->
									{#if expandedReservaId === reserva.id}
										<div transition:fly={{ y: 20, duration: 400 }} class="mt-8 pt-8 border-t border-white/10 space-y-6">
											<div>
												<h5 class="text-[10px] text-white/40 uppercase tracking-[0.3em] font-medium mb-4">Detalle de Pagos</h5>
												<div class="grid grid-cols-1 gap-2">
													{#each (reserva.dplazo || []).filter(p => p.pagado).sort((a,b) => b.numero_plazo - a.numero_plazo) as plazo}
														<div class="flex justify-between items-center bg-white/[0.02] p-4 border border-white/5 rounded-sm hover:bg-white/[0.04] transition-colors">
															<div class="flex items-center gap-4">
																<div class="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-[10px] font-medium">
																	{plazo.numero_plazo}
																</div>
																<div>
																	<p class="text-[10px] text-white/80 uppercase tracking-widest">Abono Confirmado</p>
																	<p class="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
																		{new Date(plazo.fecha_pago).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })} • {new Date(plazo.fecha_pago).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
																	</p>
																</div>
															</div>
															<div class="text-right">
																<p class="text-sm font-light tracking-widest text-white">
																	{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(plazo.monto)}
																</p>
																<p class="text-[8px] text-green-400/50 uppercase tracking-[0.2em]">Completado</p>
															</div>
														</div>
													{/each}
												</div>
											</div>
										</div>
									{/if}

									<!-- Indicador de desplegable -->
									<div class="mt-4 flex justify-center md:justify-end text-white/10 group-hover:text-white/30 transition-colors">
										<div class="flex items-center gap-2 text-[8px] uppercase tracking-[0.3em] font-light">
											<span>{expandedReservaId === reserva.id ? 'Cerrar Detalles' : 'Ver Detalle de Pagos'}</span>
											<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300 {expandedReservaId === reserva.id ? 'rotate-180' : ''}">
												<polyline points="6 9 12 15 18 9"/>
											</svg>
										</div>
									</div>
								</button>
							{/each}
						</div>
					{:else}
						<div class="h-[40vh] flex flex-col items-center justify-center text-center p-12 bg-white/[0.01] border border-dashed border-white/10 rounded-sm">
							<div class="p-4 bg-white/5 rounded-full mb-6 text-white/20">
								<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10"/></svg>
							</div>
							<h3 class="text-lg font-extralight tracking-widest uppercase mb-2">Sin Reservas</h3>
							<p class="text-xs text-white/30 font-light tracking-wide mb-6">Aún no has realizado ninguna reserva.</p>
							<a href="/experiencias" class="px-8 py-3 bg-white/5 border border-white/10 text-white font-light tracking-widest uppercase text-[10px] hover:bg-white/10 transition-all">Explorar Experiencias</a>
						</div>
					{/if}
				</div>
			{:else if activeTab === 'favoritos'}
				<div in:fade={{ duration: 300 }}>
					<div class="mb-8">
						<h3 class="text-xl font-extralight tracking-widest uppercase">Mis Avisos</h3>
						<p class="text-xs text-white/30 font-light tracking-wide mt-1">Destinos en los que estás interesado. Te avisaremos cuando haya nuevas fechas.</p>
					</div>

					{#if favoritos && favoritos.length > 0}
						<div class="space-y-4">
							{#each favoritos as fav}
								<div class="group relative bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden flex flex-col md:flex-row h-auto md:h-32 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10">
									<!-- Imagen Lateral (Portrait/Landscape depending on screen) -->
									<div class="relative w-full md:w-48 h-32 md:h-full overflow-hidden flex-shrink-0">
										{#if fav.cubicacion?.portada?.[0]}
											<img 
												src={fav.cubicacion.portada[0]} 
												alt={fav.cubicacion.nombre_ubicacion} 
												class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
											/>
										{/if}
										<div class="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent hidden md:block"></div>
									</div>

									<!-- Contenido Central -->
									<div class="flex-1 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
										<div class="text-center md:text-left">
											<h4 class="text-sm font-light tracking-widest text-white uppercase mb-1">
												{fav.cubicacion?.nombre_ubicacion}
											</h4>
											<p class="text-[9px] text-white/30 uppercase tracking-[0.2em]">
												{fav.cubicacion?.estado_ubicacion}, {fav.cubicacion?.pais_ubicacion}
											</p>
										</div>

										<!-- Controles -->
										<div class="flex items-center gap-8">
											<!-- Toggle Notificación -->
											<div class="flex items-center gap-4 border-l border-white/5 pl-8 h-8">
												<div class="flex flex-col items-end">
													<span class="text-[8px] uppercase tracking-[0.2em] {fav.notificar ? 'text-green-400' : 'text-white/20'} transition-colors">
														{fav.notificar ? 'Alertas ON' : 'Alertas OFF'}
													</span>
												</div>
												<label class="relative inline-flex items-center cursor-pointer">
													<input 
														type="checkbox" 
														bind:checked={fav.notificar} 
														on:change={(e) => actualizarNotificacion(fav.id, e.target.checked)}
														class="sr-only peer" 
													/>
													<div class="w-8 h-4 bg-white/5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/20 after:border-white/10 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-500/20 peer-checked:after:bg-green-400"></div>
												</label>
											</div>

											<!-- Botones Acción -->
											<div class="flex items-center gap-2">
												<a 
													href="/ubicacion/{formatearNombreParaURL(fav.cubicacion?.nombre_ubicacion)}" 
													class="p-2 text-white/20 hover:text-white transition-colors"
													title="Ver destino"
												>
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
												</a>
												<button 
													on:click={() => quitarFavorito(fav.id)}
													class="p-2 text-white/20 hover:text-red-400 transition-colors"
													title="Eliminar aviso"
												>
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
												</button>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="h-[40vh] flex flex-col items-center justify-center text-center p-12 bg-white/[0.01] border border-dashed border-white/10 rounded-sm">
							<div class="p-4 bg-white/5 rounded-full mb-6 text-white/20">
								<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
							</div>
							<h3 class="text-lg font-extralight tracking-widest uppercase mb-2">Sin Favoritos</h3>
							<p class="text-xs text-white/30 font-light tracking-wide mb-6">Aún no has guardado ningún destino en tus favoritos.</p>
							<a href="/experiencias" class="px-8 py-3 bg-white/5 border border-white/10 text-white font-light tracking-widest uppercase text-[10px] hover:bg-white/10 transition-all">Explorar Destinos</a>
						</div>
					{/if}
				</div>
			<!-- {:else if activeTab === 'notificaciones'}
				<div class="h-[60vh] flex flex-col items-center justify-center text-center p-12 bg-white/[0.01] border border-dashed border-white/10 rounded-sm" in:fade>
					<div class="p-4 bg-white/5 rounded-full mb-6 text-white/20">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
							<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"></path>
						</svg>
					</div>
					<h3 class="text-lg font-extralight tracking-widest uppercase mb-2">Próximamente</h3>
					<p class="text-xs text-white/30 font-light tracking-wide max-w-xs">Tus notificaciones de sistema aparecerán aquí.</p>
				</div> -->
			{/if}
		</main>
	</div>
</div>
