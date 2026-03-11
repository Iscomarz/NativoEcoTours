<script>
	import { onMount } from 'svelte';
	import TarcilaBackground from '$lib/assets/backgrounds/tarcila.jpg';
	import ButtonCotizacion from '$lib/components/ButtonCotizacion.svelte';

	let scrollY = 0;

	onMount(() => {
		const handleScroll = () => scrollY = window.scrollY;
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<svelte:window bind:scrollY />

<div class="relative min-h-screen bg-black">

	<!-- Hero con parallax -->
	<section class="relative h-screen overflow-hidden">
		<div
			class="absolute inset-0 bg-cover bg-center"
			style="background-image: url({TarcilaBackground}); transform: translateY({scrollY * 0.5}px) scale(1.1);"
		>
			<div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/85"></div>
		</div>

		<div class="relative z-10 flex items-center justify-center h-full text-center px-6">
			<div class="max-w-4xl mx-auto space-y-8 animate-fade-in">
				<!-- Icono más discreto -->
				<div class="w-10 h-10 mx-auto mb-8 border border-white/20 flex items-center justify-center">
					<svg class="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
					</svg>
				</div>
				<p class="text-green-400/60 text-xs tracking-[0.5em] uppercase font-extralight">Nativo Eco Tours</p>
				<h1 class="text-3xl md:text-5xl font-extralight text-white leading-tight tracking-[0.15em]">
					¿Quiénes<br>
					<span class="text-white/50">somos?</span>
				</h1>
				<div class="w-12 h-px bg-white/20 mx-auto"></div>
			</div>
		</div>

		<!-- Scroll indicator -->
		<div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
			<div class="w-px h-8 bg-white/20"></div>
			<div class="w-1 h-1 bg-white/30 rounded-full"></div>
		</div>
	</section>

	<!-- Contenido principal -->
	<section class="relative py-24 px-6 bg-black">
		<div class="max-w-4xl mx-auto">

			<!-- Párrafo introductorio -->
			<div class="text-center mb-20">
				<p class="text-sm md:text-base leading-loose text-white/40 font-extralight tracking-wide">
					Creamos experiencias que <span class="text-white/70">despiertan</span>: viajes donde la naturaleza y las prácticas de bienestar se convierten en medios de <span class="text-white/70">conexión interior</span> en los lugares más extraordinarios de <span class="text-white/70">Chihuahua</span>.
				</p>
			</div>

			<!-- Divisor -->
			<div class="flex items-center gap-6 mb-20">
				<div class="flex-1 h-px bg-white/10"></div>
				<span class="text-xs text-green-400/40 font-extralight tracking-[0.4em] uppercase">Nuestros pilares</span>
				<div class="flex-1 h-px bg-white/10"></div>
			</div>

			<!-- Features grid minimalista -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
				<!-- Feature 1 -->
				<div class="bg-black p-8 md:p-10 space-y-4 hover:bg-white/[0.02] transition-colors">
					<div class="w-8 h-8 border border-white/15 flex items-center justify-center mb-6">
						<svg class="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
						</svg>
					</div>
					<h3 class="text-xs font-light text-green-400/70 tracking-[0.35em] uppercase">Experiencias Auténticas</h3>
					<p class="text-xs text-white/25 font-extralight leading-relaxed">Vivencias genuinas en contacto directo con la naturaleza y los paisajes únicos de Chihuahua.</p>
				</div>

				<!-- Feature 2 -->
				<div class="bg-black p-8 md:p-10 space-y-4 hover:bg-white/[0.02] transition-colors">
					<div class="w-8 h-8 border border-white/15 flex items-center justify-center mb-6">
						<svg class="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
						</svg>
					</div>
					<h3 class="text-xs font-light text-green-400/70 tracking-[0.35em] uppercase">Conexión Interior</h3>
					<p class="text-xs text-white/25 font-extralight leading-relaxed">Espacios diseñados para el autoconocimiento, la reflexión y el bienestar integral.</p>
				</div>

				<!-- Feature 3 -->
				<div class="bg-black p-8 md:p-10 space-y-4 hover:bg-white/[0.02] transition-colors">
					<div class="w-8 h-8 border border-white/15 flex items-center justify-center mb-6">
						<svg class="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
						</svg>
					</div>
					<h3 class="text-xs font-light text-green-400/70 tracking-[0.35em] uppercase">Lugares Únicos</h3>
					<p class="text-xs text-white/25 font-extralight leading-relaxed">Los rincones más hermosos y especiales del estado de Chihuahua, cuidadosamente seleccionados.</p>
				</div>
			</div>

		</div>
	</section>

	<!-- CTA Section -->
	<section
		class="relative py-24 px-6 border-t border-white/10"
		style="background-image: url({TarcilaBackground}); background-size: cover; background-position: center; background-attachment: fixed;"
	>
		<div class="absolute inset-0 bg-black/75"></div>
		<div class="relative z-10 max-w-3xl mx-auto text-center space-y-6">
			<p class="text-xs text-green-400/50 font-extralight tracking-[0.5em] uppercase">Una invitación</p>
			<h2 class="text-2xl md:text-3xl font-extralight text-white tracking-[0.15em]">
				Descubre tu próxima<br>
				<span class="text-white/50">aventura interior</span>
			</h2>
			<div class="w-12 h-px bg-white/20 mx-auto"></div>
			<p class="text-xs text-white/30 font-extralight leading-loose tracking-wide max-w-lg mx-auto">
				Únete a nosotros en un viaje transformador donde cada experiencia es una oportunidad de crecimiento personal.
			</p>
			<div class="pt-4 flex justify-center">
				<ButtonCotizacion />
			</div>
		</div>
	</section>

</div>