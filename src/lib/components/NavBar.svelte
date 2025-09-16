<script>
	import LogoMano from '$lib/assets/logos/logoManoNativo.png';
	import LogoManoBlanco from '$lib/assets/logos/logoManoBlanco.png';
	import User from '$lib/assets/icons/user.png';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let session;
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

	<ul class="flex gap-6">
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
</nav>
