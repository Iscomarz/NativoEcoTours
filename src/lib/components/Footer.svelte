<script>
	import LogoNativo from '$lib/assets/logos/logoNativo.png';
	import LogoInstagram from '$lib/assets/logos/logoInsta.png';
	import LogoFacebook from '$lib/assets/logos/logoFace.png';
	import LogoYoutube from '$lib/assets/logos/logoYoutube.png';
	import VinayakBackground from '$lib/assets/backgrounds/vinayak-jayaram.jpg';
	import TarcilaBackground from '$lib/assets/backgrounds/tarcila.jpg';
	import { page } from '$app/stores';
</script>

<footer 
	class="text-white py-8 px-4"
	class:bg-black={$page.url.pathname !== '/'}
	style={$page.url.pathname === '/' || $page.url.pathname === '/experiencias' ? `background-image: url(${TarcilaBackground}); background-size: cover; background-position: center; background-attachment: fixed;` : ''}
>
	<div class="flex flex-col items-center">
		<img src={LogoNativo} alt="Logo NativoEcoApp" class="mb-3 h-40" />
		<p class="text-gray-400 mb-4">TODOS LOS DERECHOS RESERVADOS</p>
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
			<a href="/experiencias" class="hover:text-green-400">Experiencias</a>
			<a href="/about" class="hover:text-green-400">Nosotros</a>
			<a href="/cotizaciones" class="hover:text-green-400">Cotizaciones</a>
			<a href="/faq" class="hover:text-green-400">FAQ</a>
		</div>
		<div class="flex flex-col gap-2 text-left">
			<a href="/aviso-legal" class="hover:text-green-400">Aviso legal</a>
			<a href="/politica-privacidad" class="hover:text-green-400">Política de Privacidad</a>
			<a href="/politica-cookies" class="hover:text-green-400">Política de Cookies</a>
		</div>
		<div class="flex flex-col gap-2">
			<span class="mb-1">Recibir avisos para las próximas experiencias</span>
			<form class="flex flex-col gap-2">
				<input
					type="email"
					placeholder="Correo electrónico"
					class="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
				/>
				<button type="submit" class="bg-green-500 hover:bg-green-600 rounded px-3 py-2 text-white">
					Subscribirse
				</button>
			</form>
		</div>
	</div>
</footer>