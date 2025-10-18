<script>
	import LogoMano from '$lib/assets/logos/logoManoNativo.png';
	import LogoManoBlanco from '$lib/assets/logos/logoManoBlanco.png';
	import User from '$lib/assets/icons/user.png';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';

	export let session;

	// Estado para controlar si el menú móvil está abierto
	let menuAbierto = false;

	// Alternar el estado del menú
	function toggleMenu() {
		menuAbierto = !menuAbierto;
	}
</script>

<nav
	class="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-4 text-black transition-colors duration-300"
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
	<ul class="hidden gap-6 md:flex">
		{#if session}
			<p class:text-white={$page.url.pathname !== '/'}>Bienvenido, {session.user.email}</p>
		{/if}
		<li>
			<a
				href="/experiencias"
				class="hover:text-green-400"
				class:text-white={$page.url.pathname !== '/'}>Experiencias</a
			>
		</li>
		<li>
			<a href="/about" class="hover:text-green-400" class:text-white={$page.url.pathname !== '/'}
				>Nosotros</a
			>
		</li>

		<li>
			<a
				href="/cotizacion"
				class="hover:text-green-400"
				class:text-white={$page.url.pathname !== '/'}>Cotizaciones</a
			>
		</li>

		{#if !session}
			<li>
				<a href="/login" class="hover:text-green-400" class:text-white={$page.url.pathname !== '/'}
					>Login</a
				>
				<img src={User} alt="User Icon" class="ml-1 inline-block h-4 w-4" />
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
					Logout
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
		<ul class="flex flex-col gap-6">
			{#if session}
				<p class="text-white">Bienvenido, {session.user.email}</p>
			{/if}

			<li>
				<a
					href="/experiencias"
					class="block py-2 text-lg text-white hover:text-green-400"
					on:click={() => (menuAbierto = false)}
				>
					Experiencias
				</a>
			</li>

			<li>
				<a
					href="/cotizacion"
					class="block py-2 text-lg text-white hover:text-green-400"
					on:click={() => (menuAbierto = false)}
				>
					Cotizaciones
				</a>
			</li>

			<li>
				<a
					href="/about"
					class="block py-2 text-lg text-white hover:text-green-400"
					on:click={() => (menuAbierto = false)}
				>
					Nosotros
				</a>
			</li>

			{#if !session}
				<li>
					<a
						href="/login"
						class="block py-2 text-lg text-white hover:text-green-400"
						on:click={() => (menuAbierto = false)}
					>
						Login
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
							Logout
						</button>
					</form>
				</li>
			{/if}
		</ul>
	</div>
{/if}
