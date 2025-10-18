<script>
	import { onMount } from 'svelte';
	
	let scrollY = 0;
	
	onMount(() => {
		const handleScroll = () => scrollY = window.scrollY;
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<svelte:window bind:scrollY />

<div class="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900">
	<!-- Hero Section con Parallax -->
	<section class="relative h-screen overflow-hidden">
		<!-- Background Image con Parallax -->
		<div 
			class="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 transition-transform duration-1000"
			style="background-image: url('/path/to/hero-nature-image.jpg'); transform: translateY({scrollY * 0.5}px) scale(1.1);"
		>
			<div class="absolute inset-0 bg-black/60"></div>
		</div>
		
		<!-- Content Hero -->
		<div class="relative z-10 flex items-center justify-center h-full text-center px-6">
			<div class="max-w-4xl mx-auto space-y-8 animate-fade-in">
				<!-- Logo o Icono Central -->
				<div class="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
					<svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
					</svg>
				</div>
				
				<h1 class="text-6xl md:text-8xl font-bold text-white leading-tight">
					<span class="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
						¿Quiénes
					</span>
					<br>
					<span class="text-white">somos?</span>
				</h1>
				
				<!-- Decorative Line -->
				<div class="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-600 mx-auto rounded-full"></div>
			</div>
		</div>
		
		<!-- Scroll Indicator -->
		<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
			<div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
				<div class="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
			</div>
		</div>
	</section>

	<!-- Main Content Section -->
	<section class="relative py-24 px-6">
		<!-- Background Pattern -->
		<div class="absolute inset-0 opacity-5">
			<div class="absolute inset-0" style="background-image: radial-gradient(circle, #10b981 1px, transparent 1px); background-size: 50px 50px;"></div>
		</div>
		
		<div class="max-w-6xl mx-auto relative z-10">
			<!-- Content Card -->
			<div class="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-lg rounded-3xl p-12 md:p-16 shadow-2xl border border-neutral-700/50">
				<!-- Text Content -->
				<div class="text-center space-y-8 mb-16">
					<p class="text-2xl md:text-3xl lg:text-4xl leading-relaxed text-gray-200 font-light">
						Creamos experiencias que <span class="font-semibold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">despiertan</span>: viajes donde la naturaleza y las prácticas de bienestar se convierten en medios de <span class="font-semibold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">conexión interior</span> en los lugares más extraordinarios de <span class="font-semibold text-green-400">Chihuahua</span>.
					</p>
				</div>
				
				<!-- Image Gallery -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
					<!-- Image 1 -->
					<div class="group relative overflow-hidden rounded-2xl aspect-square bg-neutral-800">
						<img 
							src="/path/to/nature-image-1.jpg" 
							alt="Naturaleza de Chihuahua" 
							class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
						>
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
						<div class="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
							<p class="font-semibold">Conexión Natural</p>
						</div>
					</div>
					
					<!-- Image 2 -->
					<div class="group relative overflow-hidden rounded-2xl aspect-square bg-neutral-800">
						<img 
							src="/path/to/wellness-image.jpg" 
							alt="Prácticas de bienestar" 
							class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
						>
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
						<div class="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
							<p class="font-semibold">Bienestar Interior</p>
						</div>
					</div>
					
					<!-- Image 3 -->
					<div class="group relative overflow-hidden rounded-2xl aspect-square bg-neutral-800 md:col-span-2 lg:col-span-1">
						<img 
							src="/path/to/chihuahua-landscape.jpg" 
							alt="Paisajes de Chihuahua" 
							class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
						>
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
						<div class="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
							<p class="font-semibold">Lugares Extraordinarios</p>
						</div>
					</div>
				</div>
				
				<!-- Features Grid -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					<!-- Feature 1 -->
					<div class="text-center space-y-4 group">
						<div class="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
							<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-green-400">Experiencias Auténticas</h3>
						<p class="text-gray-300">Vivencias genuinas en contacto directo con la naturaleza</p>
					</div>
					
					<!-- Feature 2 -->
					<div class="text-center space-y-4 group">
						<div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
							<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-emerald-400">Conexión Interior</h3>
						<p class="text-gray-300">Espacios para el autoconocimiento y la reflexión</p>
					</div>
					
					<!-- Feature 3 -->
					<div class="text-center space-y-4 group">
						<div class="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
							<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-teal-400">Lugares Únicos</h3>
						<p class="text-gray-300">Los rincones más hermosos y especiales de Chihuahua</p>
					</div>
				</div>
			</div>
		</div>
	</section>
	
	<!-- Call to Action Section -->
	<section class="py-24 px-6 bg-gradient-to-r from-green-900/50 to-emerald-900/50">
		<div class="max-w-4xl mx-auto text-center space-y-8">
			<h2 class="text-4xl md:text-5xl font-bold text-white">
				Descubre tu próxima 
				<span class="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
					aventura interior
				</span>
			</h2>
			
			<p class="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
				Únete a nosotros en un viaje transformador donde cada experiencia es una oportunidad de crecimiento personal.
			</p>
			
			<div class="pt-8">
				<a 
					href="/experiencias" 
					class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
				>
					Explorar Experiencias
					<svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
					</svg>
				</a>
			</div>
		</div>
	</section>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.animate-fade-in {
		animation: fade-in 1.2s ease-out;
	}
</style>