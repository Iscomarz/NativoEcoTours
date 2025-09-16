<script>
	import bgRegistro from '$lib/assets/backgrounds/bgRegistro.png';
	import googleIcon from '$lib/assets/logos/logoGoogle.png';
	export let form;
</script>

<div class="flex min-h-screen">
	<!-- Imagen lateral izquierda -->
	<div
		class="hidden bg-cover bg-center md:flex md:w-1/2"
		style="background-image: url({bgRegistro});"
	>
		<div class="flex h-full w-full items-center justify-center bg-black/40">
			<h2 class="text-3xl font-bold text-white">EMPIEZA UNA NUEVA AVENTURA...</h2>
		</div>
	</div>

	<!-- Formulario lado derecho -->
	<div class="flex w-full items-center justify-center bg-black px-8 py-12 md:w-1/2">
		<div class="w-full max-w-md">
			<h1 class="mb-2 text-2xl font-bold text-white">CREA TU CUENTA NATIVO</h1>
			<p class="mb-6 text-sm text-gray-400">
				Ya tienes una cuenta?
				<a href="/login" class="font-medium text-green-500 hover:underline">Login</a>
			</p>

			<form method="POST" class="space-y-4 text-white">
				<div class="grid grid-cols-2 gap-4">
					<input
						type="text"
						id="nombre"
						name="nombre"
						placeholder="Nombre"
						class="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
						required
					/>

					<input
						type="text"
						id="apellido"
						name="apellido"
						placeholder="Apellido"
						class="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
						required
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<input
						type="text"
						id="pais"
						name="pais"
						placeholder="País / Estado"
						class="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
						required
					/>

					<input
						type="text"
						id="telefono"
						name="telefono"
						placeholder="Teléfono"
						class="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
						required
					/>
				</div>

				<input
					type="email"
					id="correo"
					name="correo"
					placeholder="Email"
					class="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
					required
				/>

				<input
					type="password"
					id="password"
					name="password"
					placeholder="Contraseña"
					class="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
					required
				/>

				<!-- Botón Crear Cuenta -->
				<button
					type="submit"
					formaction="login?/register"
					class="w-full rounded-md bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-800 focus:ring-2 focus:ring-green-400 focus:outline-none"
				>
					Crear Cuenta
				</button>

				<!-- Botón Google -->
				<button
					type="button"
					class="flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-gray-100"
				>
					<img src={googleIcon} alt="Google" class="h-5 w-5" />
					<span>Continuar con Google</span>
				</button>
			</form>

			<!-- Redes sociales -->
			<div class="mt-6 flex justify-center gap-16">
				<!-- Instagram -->
				<a
					href="https://www.instagram.com/nativo_xx/"
					target="_blank"
					aria-label="Instagram"
					class="group"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						class="h-8 w-8 transition-transform duration-200 group-hover:scale-110 group-hover:fill-pink-500"
						fill="#ffffffff"
						viewBox="0 0 256 256"
					>
						<path
							d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"
						></path>
					</svg>
				</a>
				<!-- YouTube -->
				<a
					href="https://www.youtube.com/@nativoecotours4828"
					target="_blank"
					aria-label="YouTube"
					class="group"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						class="h-8 w-8 transition-transform duration-200 group-hover:scale-110 group-hover:fill-red-600"
						fill="#ffffffff"
						viewBox="0 0 256 256"
					>
						<path
							d="M164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,145.05V111l25.58,17ZM234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z"
						></path>
					</svg>
				</a>
				<!-- Facebook -->
				<a
					href="https://www.facebook.com/p/Nativo-100071924532907/?locale=es_LA"
					target="_blank"
					aria-label="Facebook"
					class="group"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						class="h-8 w-8 transition-transform duration-200 group-hover:scale-110 group-hover:fill-blue-600"
						fill="#ffffffff"
						viewBox="0 0 256 256"
					>
						<path
							d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"
						></path>
					</svg>
				</a>
			</div>
		</div>
	</div>
</div>
