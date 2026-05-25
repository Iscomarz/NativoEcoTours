<script>
	import LogoNativo from '$lib/assets/logos/logoNativo.png';
	import LogoInstagram from '$lib/assets/logos/logoInsta.png';
	import LogoFacebook from '$lib/assets/logos/logoFace.png';
	import LogoYoutube from '$lib/assets/logos/logoYouTube.png';
	import VinayakBackground from '$lib/assets/backgrounds/vinayak-jayaram.jpg';
	import TarcilaBackground from '$lib/assets/backgrounds/tarcila.jpg';
	import { page } from '$app/stores';
</script>

<footer 
	class="relative bg-black text-white py-8 px-4 overflow-hidden"
>
	{#if $page.url.pathname === '/' || $page.url.pathname === '/experiencias'}
		<!-- Fondo con imagen fixed, usando mask-image para que la imagen se difumine desde el borde superior (transparente) hacia abajo (sólido) -->
		<div 
			class="absolute inset-0 z-0 pointer-events-none"
			style="
				background-image: url({TarcilaBackground});
				background-size: cover; 
				background-position: center; 
				-webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 80px);
				mask-image: linear-gradient(to bottom, transparent 0%, black 80px);
			"
		></div>
	{/if}

	<!-- Contenedor principal de todo el contenido del footer para mantenerlo por encima del fondo -->
	<div class="relative z-10 w-full">
		<div class="flex flex-col items-center">
			<img src={LogoNativo} alt="Logo NativoEcoApp" class="mb-3 h-20" />
			<p class="text-white/20 text-xs font-extralight tracking-[0.3em] uppercase mb-4">TODOS LOS DERECHOS RESERVADOS</p>
			<div class="flex gap-8 mb-6">
				<a href="https://www.instagram.com/nativo_xx/" target="_blank" rel="noopener noreferrer">
					<img src={LogoInstagram} alt="Instagram" class="h-7 w-7 hover:scale-110 transition" />
				</a>
				<a href="https://www.youtube.com/@nativoecotours4828" target="_blank" rel="noopener noreferrer">
					<img src={LogoYoutube} alt="YouTube" class="h-7 w-7 hover:scale-110 transition" />
				</a>
				<a href="https://www.facebook.com/p/Nativo-100071924532907/?locale=es_LAp" target="_blank" rel="noopener noreferrer">
					<img src={LogoFacebook} alt="Facebook" class="h-7 w-7 hover:scale-110 transition" />
				</a>
			</div>
		</div>

		<hr class="border-gray-700 mb-6"/>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-4 w-2/3 mx-auto">
		<div class="flex flex-col gap-2 text-left">
			<a href="/experiencias" class="text-white/30 font-extralight text-xs tracking-widest hover:text-white/70 transition-colors">Experiencias</a>
			<a href="/about" class="text-white/30 font-extralight text-xs tracking-widest hover:text-white/70 transition-colors">Nosotros</a>
			<a href="/cotizaciones" class="text-white/30 font-extralight text-xs tracking-widest hover:text-white/70 transition-colors">Cotizaciones</a>
			<a href="/faq" class="text-white/30 font-extralight text-xs tracking-widest hover:text-white/70 transition-colors">FAQ</a>
		</div>
		<div class="flex flex-col gap-2 text-left">
			<a href="/aviso-legal" class="text-white/30 font-extralight text-xs tracking-widest hover:text-white/70 transition-colors">Aviso legal</a>
			<a href="/politica-privacidad" class="text-white/30 font-extralight text-xs tracking-widest hover:text-white/70 transition-colors">Política de Privacidad</a>
			<a href="/politica-cookies" class="text-white/30 font-extralight text-xs tracking-widest hover:text-white/70 transition-colors">Política de Cookies</a>
		</div>
		<div class="flex flex-col gap-2">
			<span class="text-white/20 text-xs font-extralight tracking-widest mb-1">Recibir avisos para las próximas experiencias</span>
			<form class="flex flex-col gap-2">
				<input
					type="email"
					placeholder="Correo electrónico"
					class="bg-white/5 text-white border border-white/10 px-3 py-2 text-xs font-extralight placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
				/>
				<button type="submit" class="bg-white/5 border border-white/20 hover:bg-white/10 px-3 py-2 text-white font-extralight text-xs tracking-[0.3em] uppercase transition-all duration-300">Subscribirse</button>
			</form>
		</div>
	</div>
	</div>
</footer>