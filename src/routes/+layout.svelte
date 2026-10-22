<script>
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import GoogleOneTap from '$lib/components/auth/GoogleOneTap.svelte';
	import { page } from '$app/stores';
	import { Toaster } from 'svelte-sonner';

	export let data;

	const schemaData = {
		'@context': 'https://schema.org',
		'@type': 'TravelAgency',
		'name': 'Nativo Eco Tours',
		'url': 'https://www.nativotravels.com',
		'logo': 'https://www.nativotravels.com/favicon.png',
		'image': 'https://www.nativotravels.com/favicon.png',
		'description': 'Creadores de viajes, expediciones y experiencias ecoturísticas únicas en México.',
		'telephone': '+52-614-360-4415',
		'email': 'reservas@nativotravels.com',
		'address': {
			'@type': 'PostalAddress',
			'addressLocality': 'Chihuahua',
			'addressRegion': 'Chihuahua',
			'addressCountry': 'MX'
		},
		'sameAs': [
			'https://www.instagram.com/nativo_xx/',
			'https://www.facebook.com/p/Nativo-100071924532907/?locale=es_LA',
			'https://www.youtube.com/@nativoecotours4828'
		],
		'priceRange': '$$'
	};
</script>

<svelte:head>
	<link rel="canonical" href={`https://www.nativotravels.com${$page.url.pathname === '/' ? '' : $page.url.pathname}`} />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:site_name" content="Nativo Eco Tours" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="es_MX" />
	<meta property="og:url" content={`https://www.nativotravels.com${$page.url.pathname === '/' ? '' : $page.url.pathname}`} />
	
	<!-- Twitter Cards -->
	<meta name="twitter:card" content="summary_large_image" />

	<!-- Structured Data (Schema.org) -->
	{@html `<script type="application/ld+json">${JSON.stringify(schemaData)}</script>`}
</svelte:head>

<Toaster theme="dark" expand={true} richColors  />

<GoogleOneTap session={data.session} />

<div class="flex flex-col min-h-screen">
	{#if $page.url.pathname !== '/login'}
		<NavBar session={data.session} user_profile={data.user_profile} class="fixed top-0 left-0 w-full z-50" />
	{/if}

	<main class="flex-1">
		<slot />
	</main>

	{#if $page.url.pathname !== '/login'}
		<Footer />
	{/if}
</div>
