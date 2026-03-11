<script>
	import LogoMano from '$lib/assets/logos/logoManoNativo.png';
	import LogoManoBlanco from '$lib/assets/logos/logoManoBlanco.png';
	import Campfire from '$lib/assets/icons/campfire-thin.svg';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let session;
	export let user_profile = null;


	// Estado para controlar si el menú móvil está abierto
	let menuAbierto = false;

	// Estado para controlar el scroll
	let scrollY = 0;
	
	// Calcular el color basado en el scroll (0-100px)
	$: textColor = $page.url.pathname === '/' 
		? `rgb(${Math.min(255, Math.floor((scrollY / 100) * 255))}, ${Math.min(255, Math.floor((scrollY / 100) * 255))}, ${Math.min(255, Math.floor((scrollY / 100) * 255))})`
		: 'rgb(255, 255, 255)';
	
	$: borderColor = $page.url.pathname === '/' 
		? `rgb(${Math.min(255, Math.floor((scrollY / 100) * 255))}, ${Math.min(255, Math.floor((scrollY / 100) * 255))}, ${Math.min(255, Math.floor((scrollY / 100) * 255))})`
		: 'rgb(255, 255, 255)';
	
	// Calcular el filtro de inversión para el ícono (0 = negro, 1 = blanco)
	$: iconFilter = $page.url.pathname === '/' 
		? `invert(${Math.min(1, scrollY / 100)})`
		: 'invert(1)';

	// Alternar el estado del menú
	function toggleMenu() {
		menuAbierto = !menuAbierto;
	}

	onMount(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<style>
	.login-btn {
		transition: all 0.3s ease;
		padding: 0.375rem 1rem;
		margin: -0.375rem -1rem;
	}
	
	.login-btn:hover {
		backdrop-filter: blur(4px);
	}
	
	.login-home:hover {
		background-color: rgb(0 0 0 / 0.1);
	}
	
	.login-other:hover {
		background-color: rgb(255 255 255 / 0.1);
	}
	
	.login-transition:hover {
		background-color: rgb(255 255 255 / 0.1);
	}
	
	.nav-link {
		transition: color 0.3s ease;
	}
	
	.nav-link:hover {
		color: #4ade80 !important;
	}
</style>

<nav
	class={`fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 md:px-12 xl:px-16 py-3 md:py-4 text-black transition-all duration-300 ${
		$page.url.pathname === '/' 
			? 'bg-transparent' 
			: scrollY === 0 ? 'bg-black' : 'bg-black/30 backdrop-blur-md'
	}`}
>
	{#if $page.url.pathname === '/'}
		<div class="h-10 md:h-12 font-bold">
			<a href="/"><img src={LogoMano} alt="Logo NativoEcoApp" class="h-full" /></a>
		</div>
	{:else}
		<div class="h-10 md:h-12 font-bold">
			<a href="/"><img src={LogoManoBlanco} alt="Logo NativoEcoApp" class="h-full" /></a>
		</div>
	{/if}

	<!-- Menú para desktop -->
	<div class="hidden md:flex items-center">
		{#if !session}
			<ul class="flex items-center gap-8 text-sm tracking-widest font-light">
				<li>
					<a
						href="/experiencias"
						class="nav-link relative transition-colors"
						class:text-white={$page.url.pathname !== '/'}
						class:!text-green-400={$page.url.pathname.includes('/experiencias')}
						style={$page.url.pathname === '/' ? `color: ${textColor}` : ''}
					>
						EXPERIENCIAS
						{#if $page.url.pathname.includes('/experiencias')}
							<span class="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-green-400"></span>
						{/if}
					</a>
				</li>
				<li>
					<a 
						href="/about" 
						class="nav-link relative transition-colors" 
						class:text-white={$page.url.pathname !== '/'}
						class:!text-green-400={$page.url.pathname.includes('/about')}
						style={$page.url.pathname === '/' ? `color: ${textColor}` : ''}
					>
						NOSOTROS
						{#if $page.url.pathname.includes('/about')}
							<span class="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-green-400"></span>
						{/if}
					</a>
				</li>

				<li>
					<a
						href="/cotizacion"
						class="nav-link relative transition-colors"
						class:text-white={$page.url.pathname !== '/'}
						class:!text-green-400={$page.url.pathname.includes('/cotizacion')}
						style={$page.url.pathname === '/' ? `color: ${textColor}` : ''}
					>
						COTIZACIONES
						{#if $page.url.pathname.includes('/cotizacion')}
							<span class="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-green-400"></span>
						{/if}
					</a>
				</li>

				<li>
					<a 
						href="/login" 
						class="login-btn flex items-center gap-1"
						class:login-home={$page.url.pathname === '/' && scrollY < 50}
						class:login-transition={$page.url.pathname === '/' && scrollY >= 50}
						class:login-other={$page.url.pathname !== '/'}
						class:text-white={$page.url.pathname !== '/'}
						style={$page.url.pathname === '/' ? `color: ${textColor};` : ''}
					>
						LOGIN
						<img 
							src={Campfire} 
							alt="Campfire Icon" 
							class="h-5 w-5 transition-all duration-300" 
							style="filter: {iconFilter}"
						/>
					</a>
				</li>
			</ul>
		{:else}
			<!-- Perfil de usuario logueado en desktop -->
			<div class="flex items-center gap-6">
				<a href="/perfil" class="flex items-center gap-3 group">
					<div class="flex flex-col items-end">
						<span 
							class="text-[11px] font-medium tracking-widest uppercase transition-colors group-hover:text-green-400"
							class:text-white={$page.url.pathname !== '/'}
							style={$page.url.pathname === '/' ? `color: ${textColor}` : ''}
						>
							{user_profile?.nombre || 'Explorador'} {user_profile?.apellido || ''}
						</span>
						<span class="text-[9px] text-white/30 font-light tracking-wide group-hover:text-white/50">{user_profile?.estado || 'Rumbo a la aventura'}</span>
					</div>
					<div class="relative">
						<div class="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 transition-transform group-hover:scale-105 group-hover:border-green-400/30">
							{#if user_profile?.image_perfil}
								<img src={user_profile.image_perfil} alt="Perfil" class="w-full h-full object-cover" />
							{:else}
								<div class="w-full h-full flex items-center justify-center text-white/20">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
								</div>
							{/if}
						</div>
						<div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
					</div>
				</a>
				
				<button 
					on:click={toggleMenu}
					class="p-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
					aria-label="Menú de navegación"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-white">
						<line x1="3" y1="12" x2="21" y2="12"></line>
						<line x1="3" y1="6" x2="21" y2="6"></line>
						<line x1="3" y1="18" x2="21" y2="18"></line>
					</svg>
				</button>
			</div>
		{/if}
	</div>

	<!-- Botón de menú hamburguesa (Móvil siempre, solo si NO hay sesión) -->
	{#if !session}
		<button
			class="relative flex h-8 w-8 flex-col items-center justify-center md:hidden"
			on:click={toggleMenu}
			aria-label="Abrir menú"
		>
			<span
				class="block h-0.5 w-6 transition-all duration-300 ease-in-out"
				class:bg-black={$page.url.pathname === '/'}
				class:bg-white={$page.url.pathname !== '/'}
				class:transform={menuAbierto}
				class:rotate-45={menuAbierto}
				class:translate-y-[0.3rem]={menuAbierto}
			></span>

			<span
				class="mt-2 block h-0.5 w-6 transition-all duration-300 ease-in-out"
				class:bg-black={$page.url.pathname === '/'}
				class:bg-white={$page.url.pathname !== '/'}
				class:transform={menuAbierto}
				class:-rotate-45={menuAbierto}
				class:-translate-y-[0.3rem]={menuAbierto}
			></span>
		</button>
	{/if}

</nav>

<!-- Menú lateral para móvil -->
{#if menuAbierto}
	<div
		class="fixed inset-0 z-40 bg-black/50 md:hidden"
		on:click={() => (menuAbierto = false)}
		transition:fly={{ duration: 200, opacity: 0.5 }}
	></div>

	<div
		class="fixed top-0 right-0 z-45 h-full w-full sm:w-[350px] bg-[#0A0A0A] border-l border-white/5 px-8 pt-24 shadow-2xl"
		transition:fly={{ x: 300, duration: 300, opacity: 1 }}
	>
		<div class="flex items-center justify-between mb-12">
			<span class="text-xs text-green-400 font-medium tracking-[0.4em] uppercase">Menú Nativo</span>
			<button on:click={() => (menuAbierto = false)} class="text-white/30 hover:text-white transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
			</button>
		</div>

		<ul class="flex flex-col gap-6 tracking-[0.2em] text-xs">
			{#if session}
				<li class="mb-4 pb-6 border-b border-white/5">
					<a href="/perfil" class="flex items-center gap-4 text-white hover:text-green-400 transition-colors" on:click={() => (menuAbierto = false)}>
						<div class="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5">
							{#if user_profile?.image_perfil}
								<img src={user_profile.image_perfil} alt="Perfil" class="w-full h-full object-cover" />
							{:else}
								<div class="w-full h-full flex items-center justify-center text-white/20">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
								</div>
							{/if}
						</div>
						<div class="flex flex-col">
							<span class="font-medium">{user_profile?.nombre || 'Mi Perfil'}</span>
							<span class="text-[9px] text-white/30 tracking-widest">{session.user.email}</span>
						</div>
					</a>
				</li>
			{/if}

			<li>
				<a
					href="/experiencias"
					class="relative block w-full py-3 text-white/70 hover:text-white hover:pl-2 transition-all"
					class:!text-green-400={$page.url.pathname.includes('/experiencias')}
					on:click={() => (menuAbierto = false)}
				>
					EXPERIENCIAS
				</a>
			</li>

			<li>
				<a
					href="/about"
					class="relative block w-full py-3 text-white/70 hover:text-white hover:pl-2 transition-all"
					class:!text-green-400={$page.url.pathname.includes('/about')}
					on:click={() => (menuAbierto = false)}
				>
					NOSOTROS
				</a>
			</li>

			<li>
				<a
					href="/cotizacion"
					class="relative block w-full py-3 text-white/70 hover:text-white hover:pl-2 transition-all"
					class:!text-green-400={$page.url.pathname.includes('/cotizacion')}
					on:click={() => (menuAbierto = false)}
				>
					COTIZACIONES
				</a>
			</li>

			{#if !session}
				<li class="mt-4 pt-6 border-t border-white/5">
					<a
						href="/login"
						class="flex items-center gap-2 py-3 text-white/50 hover:text-white transition-all uppercase tracking-widest"
						on:click={() => (menuAbierto = false)}
					>
						INICIAR SESIÓN
						<img src={Campfire} alt="Campfire Icon" class="h-4 w-4 opacity-50" />
					</a>
				</li>
			{/if}

			{#if session}
				<li class="mt-auto pt-12">
					<form method="POST">
						<button
							type="submit"
							formaction="/login?/logout"
							class="flex items-center gap-3 text-red-400/70 hover:text-red-400 transition-colors uppercase tracking-[0.3em] text-[10px]"
							on:click={() => (menuAbierto = false)}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
							Cerrar Sesión
						</button>
					</form>
				</li>
			{/if}
		</ul>
	</div>
{/if}
