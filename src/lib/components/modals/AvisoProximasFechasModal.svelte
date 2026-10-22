<script>
	import { fade, fly, scale } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { supabase } from '$lib/core/supabase/client';
	import { toast } from 'svelte-sonner';

	export let isOpen = false;
	export let session = null;

	const dispatch = createEventDispatcher();

	let email = '';
	let loading = false;
	let success = false;

	function close() {
		dispatch('close');
	}

	function handleKeydown(e) {
		if (isOpen && e.key === 'Escape') close();
	}

	async function handleSubmit() {
		const targetEmail = session?.user?.email || email.trim().toLowerCase();

		if (!targetEmail) {
			toast.error('Por favor ingresa un correo electrónico.');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(targetEmail)) {
			toast.error('Por favor ingresa un correo electrónico válido.');
			return;
		}

		loading = true;

		try {
			// 1. Guardar en newsletter_subscriptions (público / leads)
			const { error: errNews } = await supabase
				.from('newsletter_subscriptions')
				.insert([{ email: targetEmail, activo: true }]);

			// Si el usuario tiene sesión, vincularlo también a rfavoritoubicacion (Urique = 1)
			if (session?.user?.id) {
				await supabase
					.from('rfavoritoubicacion')
					.insert([{ usuario_id: session.user.id, ubicacion_id: 1, notificar: true }]);
			}

			if (errNews && errNews.code === '23505') {
				toast.info('Ya te tenemos registrado para recibir las próximas fechas.');
			} else if (errNews) {
				console.error(errNews);
				toast.error('Hubo un error al registrar tu correo. Inténtalo de nuevo.');
				loading = false;
				return;
			} else {
				toast.success('¡Listo! Te avisaremos en cuanto abramos nuevas fechas.');
			}

			success = true;
			setTimeout(() => {
				close();
				success = false;
				email = '';
			}, 1800);
		} catch (err) {
			console.error(err);
			toast.error('Ocurrió un error inesperado.');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div 
		class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md"
		on:click|self={close}
		transition:fade={{ duration: 300 }}
	>
		<div 
			class="relative w-full max-w-md overflow-hidden bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl"
			transition:fly={{ y: 20, duration: 400 }}
		>
			<!-- Decorative Background -->
			<div class="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 blur-[100px] rounded-full pointer-events-none"></div>
			<div class="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

			<!-- Close Icon -->
			<button 
				on:click={close}
				class="absolute top-4 right-4 p-2 text-white/30 hover:text-white transition-colors z-10"
				aria-label="Cerrar modal"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>

			<div class="relative p-8 text-center">
				<div class="flex justify-center mb-6">
					<div class="p-4 bg-white/5 rounded-full border border-white/10" in:scale={{ delay: 200, duration: 400 }}>
						{#if success}
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400">
								<polyline points="20 6 9 17 4 12"></polyline>
							</svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-green-400">
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
								<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
							</svg>
						{/if}
					</div>
				</div>

				<h3 class="text-2xl font-extralight tracking-widest text-white uppercase mb-3">
					{success ? '¡Aviso Registrado!' : 'Próximas Fechas'}
				</h3>
				
				<p class="text-xs text-white/50 leading-relaxed font-light mb-8 max-w-sm mx-auto">
					{success 
						? 'Te notificaremos por correo prioritario en cuanto abramos nuevas expediciones.' 
						: 'Déjanos tu correo para avisarte en cuanto publiquemos nuevas aventuras y fechas disponibles.'}
				</p>

				{#if !success}
					{#if session?.user}
						<div class="space-y-4">
							<div class="bg-white/5 border border-white/10 p-4 rounded-xl text-left">
								<p class="text-[10px] uppercase tracking-widest text-white/40 mb-1">Notificar a tu cuenta:</p>
								<p class="text-sm font-light text-white font-mono">{session.user.email}</p>
							</div>

							<button
								type="button"
								on:click={handleSubmit}
								disabled={loading}
								class="w-full py-3.5 bg-green-500 text-black text-xs font-semibold uppercase tracking-[0.25em] rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50"
							>
								{loading ? 'Registrando...' : 'Confirmar Aviso'}
							</button>
						</div>
					{:else}
						<form on:submit|preventDefault={handleSubmit} class="space-y-4">
							<input
								type="email"
								placeholder="ejemplo@correo.com"
								bind:value={email}
								disabled={loading}
								class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-green-500/50 transition-all font-light"
								required
							/>

							<button
								type="submit"
								disabled={loading}
								class="w-full py-3.5 bg-green-500 text-black text-xs font-semibold uppercase tracking-[0.25em] rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50"
							>
								{loading ? 'Registrando...' : 'Avísenme de Nuevas Fechas'}
							</button>
						</form>

						<div class="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-[10px] text-white/40 uppercase tracking-widest">
							<span>¿Tienes una cuenta?</span>
							<a href="/login" class="text-green-400 hover:text-green-300 transition-colors border-b border-green-500/30 pb-0.5">
								Inicia Sesión
							</a>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}
