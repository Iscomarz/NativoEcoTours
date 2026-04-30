<script>
	import { fade, fly, scale } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	export let isOpen = false;
	export let title = "¡No te lo pierdas!";
	export let message = "Inicia sesión o regístrate para que podamos avisarte en cuanto este destino tenga nuevas fechas disponibles.";

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function handleKeydown(e) {
		if (isOpen && e.key === 'Escape') close();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- Overlay -->
	<div 
		class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
		on:click|self={close}
		transition:fade={{ duration: 300 }}
	>
		<!-- Modal Content -->
		<div 
			class="relative w-full max-w-md overflow-hidden bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl"
			transition:fly={{ y: 20, duration: 400 }}
		>
			<!-- Decorative Background -->
			<div class="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 blur-[100px] rounded-full"></div>
			<div class="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full"></div>

			<!-- Header -->
			<div class="relative p-8 text-center">
				<div class="flex justify-center mb-6">
					<div class="p-4 bg-white/5 rounded-full border border-white/10" in:scale={{ delay: 200, duration: 400 }}>
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-green-400">
							<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
							<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
						</svg>
					</div>
				</div>

				<h3 class="text-2xl font-extralight tracking-widest text-white uppercase mb-4">
					{title}
				</h3>
				
				<p class="text-sm text-white/40 leading-relaxed font-light mb-8">
					{message}
				</p>

				<!-- Actions -->
				<div class="grid grid-cols-1 gap-3">
					<a 
						href="/login" 
						class="w-full py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-gray-200 transition-colors text-center"
					>
						Iniciar Sesión
					</a>
					<a 
						href="/registro" 
						class="w-full py-4 bg-white/5 text-white border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-white/10 transition-colors text-center"
					>
						Crear Cuenta
					</a>
					<button 
						on:click={close}
						class="mt-2 text-[10px] text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors"
					>
						Quizá después
					</button>
				</div>
			</div>

			<!-- Close Icon -->
			<button 
				on:click={close}
				class="absolute top-4 right-4 p-2 text-white/20 hover:text-white transition-colors"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</div>
	</div>
{/if}

<style>
	/* Optativo: asegurar que el modal siempre esté por encima de todo */
	:global(body.modal-open) {
		overflow: hidden;
	}
</style>
