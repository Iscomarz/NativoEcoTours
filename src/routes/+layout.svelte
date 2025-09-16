<script>
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';

	export let data;

</script>

<div class="flex flex-col min-h-screen">
	{#if $page.url.pathname !== '/login'}
		<!-- No mostrar NavBar ni Footer en la página de login -->
		 <NavBar session={data.session} class="fixed top-0 left-0 w-full z-50" />
	{:else}
		<!-- Mostrar NavBar y Footer en otras páginas -->
		
	{/if}
	

	<main class="flex-1">
		<slot />
	</main>

	{#if $page.url.pathname !== '/login'}
		<!-- No mostrar NavBar ni Footer en la página de login -->
		 <Footer />
	{:else}
		<!-- Mostrar NavBar y Footer en otras páginas -->
		
	{/if}
</div>