<script>
	import LogoMano from '$lib/assets/logos/logoManoNativo.png';
	import LogoManoBlanco from '$lib/assets/logos/logoManoBlanco.png';
	import User from '$lib/assets/icons/user.png';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let session;

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
		border-color: rgba(0, 0, 0, 0.308) !important;
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
	class="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-24 py-5 text-black transition-colors duration-300"
	class:bg-[#111111]={$page.url.pathname !== '/'}
	class:bg-transparent={$page.url.pathname === '/'}
>
	{#if $page.url.pathname === '/'}
		<div class="h-16 text-xl font-bold">
			<a href="/"><img src={LogoMano} alt="Logo NativoEcoApp" class="h-full" /></a>
		</div>
	{:else}
		<div class="h-16 text-xl font-bold">
			<a href="/"><img src={LogoManoBlanco} alt="Logo NativoEcoApp" class="h-full" /></a>
		</div>
	{/if}

	<!-- Menú para desktop (oculto en móvil) -->
	<ul class="hidden items-center gap-8 md:flex">
		{#if session}
			<p 
				class:text-white={$page.url.pathname !== '/'}
				style={$page.url.pathname === '/' ? `color: ${textColor}` : ''}
			>
				Bienvenido, {session.user.email}
			</p>
		{/if}
		<li>
			<a
				href="/experiencias"
				class="nav-link transition-colors"
				class:text-white={$page.url.pathname !== '/'}
				style={$page.url.pathname === '/' ? `color: ${textColor}` : ''}
			>
				EXPERIENCIAS
			</a>
		</li>
		<li>
			<a 
				href="/about" 
				class="nav-link transition-colors" 
				class:text-white={$page.url.pathname !== '/'}
				style={$page.url.pathname === '/' ? `color: ${textColor}` : ''}
			>
				NOSOTROS
			</a>
		</li>

		<li>
			<a
				href="/cotizacion"
				class="nav-link transition-colors"
				class:text-white={$page.url.pathname !== '/'}
				style={$page.url.pathname === '/' ? `color: ${textColor}` : ''}
			>
				COTIZACIONES
			</a>
		</li>

		{#if !session}
			<li>
				<a 
					href="/login" 
					class="login-btn flex items-center gap-2 rounded-full border-2 px-4 py-2"
					class:login-home={$page.url.pathname === '/' && scrollY < 50}
					class:login-transition={$page.url.pathname === '/' && scrollY >= 50}
					class:login-other={$page.url.pathname !== '/'}
					class:border-black={$page.url.pathname === '/' && scrollY === 0}
					class:border-white={$page.url.pathname !== '/'}
					class:text-white={$page.url.pathname !== '/'}
					style={$page.url.pathname === '/' ? `color: ${textColor}; border-color: ${borderColor}` : ''}
				>
					LOGIN
					<img 
						src={User} 
						alt="User Icon" 
						class="h-4 w-4 transition-all duration-300" 
						style="filter: {iconFilter}"
					/>
				</a>
			</li>
		{/if}

		{#if session}
			<form method="POST" class="inline">
				<button
					type="submit"
					formaction="/login?/logout"
					class="ml-4 cursor-pointer hover:text-green-400"
					class:text-white={$page.url.pathname !== '/'}
				>
					LOGOUT
				</button>
			</form>
		{/if}
	</ul>

	<!-- Botón de menú hamburguesa (solo en móvil) -->
	<button
		class="relative flex h-8 w-8 flex-col items-center justify-center md:hidden"
		on:click={toggleMenu}
		aria-label="Abrir menú"
	>
		<!-- Línea superior -->
		<span
			class="block h-0.5 w-6 transition-all duration-300 ease-in-out"
			class:bg-black={$page.url.pathname === '/'}
			class:bg-white={$page.url.pathname !== '/'}
			class:transform={menuAbierto}
			class:rotate-45={menuAbierto}
			class:translate-y-[0.3rem]={menuAbierto}
		></span>

		<!-- Línea inferior (sin línea media) -->
		<span
			class="mt-2 block h-0.5 w-6 transition-all duration-300 ease-in-out"
			class:bg-black={$page.url.pathname === '/'}
			class:bg-white={$page.url.pathname !== '/'}
			class:transform={menuAbierto}
			class:-rotate-45={menuAbierto}
			class:-translate-y-[0.3rem]={menuAbierto}
		></span>
	</button>
</nav>

<!-- Menú lateral para móvil -->
{#if menuAbierto}
	<div
		class="fixed inset-0 z-40 bg-black/50 md:hidden"
		on:click={() => (menuAbierto = false)}
		transition:fly={{ duration: 200, opacity: 0.5 }}
	></div>

	<div
		class="fixed top-0 left-0 z-45 h-full w-[70%] bg-[#111111] px-6 pt-24 shadow-xl md:hidden"
		transition:fly={{ x: -300, duration: 300, opacity: 1 }}
	>
		<ul class="flex flex-col gap-8">
			{#if session}
				<p class="text-white">Bienvenido, {session.user.email}</p>
			{/if}

			<li>
				<a
					href="/experiencias"
					class="block py-2 text-lg text-white hover:text-green-400"
					on:click={() => (menuAbierto = false)}
				>
					EXPERIENCIAS
				</a>
			</li>

			<li>
				<a
					href="/cotizacion"
					class="block py-2 text-lg text-white hover:text-green-400"
					on:click={() => (menuAbierto = false)}
				>
					COTIZACIONES
				</a>
			</li>

			<li>
				<a
					href="/about"
					class="block py-2 text-lg text-white hover:text-green-400"
					on:click={() => (menuAbierto = false)}
				>
					NOSOTROS
				</a>
			</li>

			{#if !session}
				<li>
					<a
						href="/login"
						class="block py-2 text-lg text-white hover:text-green-400"
						on:click={() => (menuAbierto = false)}
					>
						LOGIN
						<img src={User} alt="User Icon" class="ml-1 inline-block h-4 w-4" />
					</a>
				</li>
			{/if}

			{#if session}
				<li>
					<form method="POST">
						<button
							type="submit"
							formaction="/login?/logout"
							class="py-2 text-lg text-white hover:text-green-400"
							on:click={() => (menuAbierto = false)}
						>
							LOGOUT
						</button>
					</form>
				</li>
			{/if}
		</ul>
	</div>
{/if}
