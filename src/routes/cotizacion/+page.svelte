<script>
	import { onMount } from 'svelte';
	import { toast, Toaster } from 'svelte-sonner';
	import TarcilaBackground from '$lib/assets/backgrounds/tarcila.jpg';

	export let data;
	$: ubicaciones = data.ubicaciones || [];

	let scrollY = 0;

	// Form data
	let formData = {
		adultos: 2,
		llevaMenores: false,
		cantidadMenores: 0,
		edadesMenores: [],
		vehiculoRenta: null,
		destinos: '',
		fechaLlegada: '',
		fechaSalida: '',
		hospedaje: '',
		transporte: '',
		experiencias: [],
		presupuesto: '',
		tipoViaje: '',
		nombre: '',
		email: '',
		telefono: '',
		comentarios: ''
	};

	let currentStep = 1;
	const totalSteps = 4;

	onMount(() => {
		const handleScroll = () => scrollY = window.scrollY;
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function toggleExperiencia(experiencia) {
		if (formData.experiencias.includes(experiencia)) {
			formData.experiencias = formData.experiencias.filter(exp => exp !== experiencia);
		} else {
			formData.experiencias = [...formData.experiencias, experiencia];
		}
	}

	// Sincroniza el arreglo de edades cuando cambia la cantidad
	function updateEdadesMenores() {
		const n = parseInt(formData.cantidadMenores) || 0;
		const arr = [...formData.edadesMenores];
		while (arr.length < n) arr.push('');
		formData.edadesMenores = arr.slice(0, n);
	}

	function nextStep() {
		if (currentStep === 1) {
			if (showVehiculoRenta && formData.vehiculoRenta === null) {
				toast.error('Por favor indica si estarían dispuestos a viajar en vehículo de renta.');
				return;
			}
		}
		if (currentStep === 2) {
			if (!formData.destinos) {
				toast.error('Por favor selecciona un destino de interés.');
				return;
			}
		}
		if (currentStep < totalSteps) currentStep++;
	}

	function prevStep() {
		if (currentStep > 1) currentStep--;
	}

	function cleanForm() {
		formData = {
			adultos: 2,
			llevaMenores: false,
			cantidadMenores: 0,
			edadesMenores: [],
			vehiculoRenta: null,
			destinos: '',
			fechaLlegada: '',
			fechaSalida: '',
			hospedaje: '',
			transporte: '',
			experiencias: [],
			presupuesto: '',
			tipoViaje: '',
			nombre: '',
			email: '',
			telefono: '',
			comentarios: ''
		};
	}

	function goToStep(step) {
		if (step >= 1 && step <= totalSteps) currentStep = step;
	}

	function submitForm() {
		if (!formData.nombre || !formData.email || !formData.telefono) {
			toast.error('Por favor completa los campos de Nombre, Email y Teléfono.');
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			toast.error('Por favor ingresa un email válido.');
			return;
		}

		const menoresTexto = formData.llevaMenores && formData.cantidadMenores > 0
			? `  • Cantidad: ${formData.cantidadMenores}\n  • Edades: ${formData.edadesMenores.filter(Boolean).join(', ') || 'No especificadas'}`
			: '  Ninguno';

		const mensaje = `
🌿 *NUEVA SOLICITUD DE COTIZACIÓN - NATIVO ECO TOURS* 🌿

━━━━━━━━━━━━━━━━━━━━━
👥 *GRUPO DE VIAJE*
━━━━━━━━━━━━━━━━━━━━━
• Adultos: ${formData.adultos}
• Menores: ${formData.llevaMenores ? formData.cantidadMenores : 0}
${menoresTexto}
• Tipo de viaje: ${formData.tipoViaje || 'No especificado'}
${formData.vehiculoRenta !== null ? `• Vehículo de renta: ${formData.vehiculoRenta ? 'Sí, pueden manejar' : 'No, prefieren chofer'}` : ''}

━━━━━━━━━━━━━━━━━━━━━
📍 *DESTINO Y FECHAS*
━━━━━━━━━━━━━━━━━━━━━
• Destino: ${formData.destinos || 'No especificado'}
• Salida: ${formData.fechaSalida || 'Por definir'}
• Regreso: ${formData.fechaLlegada || 'Por definir'}

━━━━━━━━━━━━━━━━━━━━━
🏨 *PREFERENCIAS*
━━━━━━━━━━━━━━━━━━━━━
• Hospedaje: ${formData.hospedaje || 'No especificado'}
• Transporte: ${formData.transporte || 'No especificado'}
• Experiencias: ${formData.experiencias.length > 0 ? formData.experiencias.join(', ') : 'No especificado'}
• Presupuesto: ${formData.presupuesto || 'Por definir'}

━━━━━━━━━━━━━━━━━━━━━
👤 *DATOS DE CONTACTO*
━━━━━━━━━━━━━━━━━━━━━
• Nombre: ${formData.nombre}
• Email: ${formData.email}
• Teléfono: ${formData.telefono}
${formData.comentarios ? `\n💬 *Comentarios adicionales:*\n${formData.comentarios}` : ''}

━━━━━━━━━━━━━━━━━━━━━
✨ _Solicitud generada desde nativoecotours.com_
		`.trim();

		const numeroWhatsApp = '5216146029050';
		const mensajeCodificado = encodeURIComponent(mensaje);
		const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
		window.open(urlWhatsApp, '_blank');
		toast.success('¡Redirigiendo a WhatsApp! Envía el mensaje para completar tu solicitud de cotización.');
		cleanForm();
		goToStep(1);
	}

	$: showVehiculoRenta = (formData.adultos + (formData.llevaMenores ? parseInt(formData.cantidadMenores) || 0 : 0)) < 7;
	$: totalPersonas = formData.adultos + (formData.llevaMenores ? parseInt(formData.cantidadMenores) || 0 : 0);

	const stepLabels = ['Grupo', 'Destino', 'Preferencias', 'Contacto'];
</script>

<svelte:window bind:scrollY />
<Toaster />

<div class="relative min-h-screen bg-black mt-20">

	<!-- Hero minimalista -->
	<section class="relative overflow-hidden" style="height: 320px;">
		<div
			class="absolute inset-0 bg-cover bg-center"
			style="background-image: url({TarcilaBackground}); transform: translateY({scrollY * 0.25}px) scale(1.1);"
		>
			<div class="absolute inset-0 bg-black/70"></div>
		</div>
		<div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
			<p class="text-xs text-green-400/60 font-extralight tracking-[0.5em] uppercase mb-3">Nativo Eco Tours</p>
			<h1 class="text-3xl md:text-4xl font-extralight tracking-[0.2em] text-white mb-3">Cotización Personalizada</h1>
			<div class="w-12 h-px bg-white/20 mx-auto mb-3"></div>
			<p class="text-xs text-white/50 font-light tracking-wide max-w-sm">Cuéntanos sobre tu viaje ideal y crearemos una experiencia única para ti</p>
		</div>
	</section>

	<!-- Barra de progreso minimalista -->
	<div class="sticky top-16 md:top-20 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
		<div class="max-w-3xl mx-auto px-6 py-4">
			<div class="flex items-center justify-between mb-3">
				<span class="text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Paso {currentStep} — {stepLabels[currentStep - 1]}</span>
				<span class="text-xs text-white/50 font-light tracking-widest">{Math.round((currentStep / totalSteps) * 100)}%</span>
			</div>
			<!-- Indicadores de paso -->
			<div class="flex items-center gap-2">
				{#each Array(totalSteps) as _, i}
					<div class="flex-1 h-px transition-all duration-500 {i < currentStep ? 'bg-green-400/50' : 'bg-white/10'}"></div>
				{/each}
			</div>
			<div class="flex justify-between mt-2">
				{#each stepLabels as label, i}
					<span class="text-[10px] font-medium tracking-widest uppercase transition-colors duration-300 {i + 1 === currentStep ? 'text-green-400/90' : i + 1 < currentStep ? 'text-white/60' : 'text-white/25'}">{label}</span>
				{/each}
			</div>
		</div>
	</div>

	<!-- Formulario -->
	<section class="relative z-10 py-16 px-6">
		<div class="max-w-3xl mx-auto">
			<div class="bg-white/[0.03] border border-white/10 p-8 md:p-12">

				<!-- PASO 1: Grupo -->
				{#if currentStep === 1}
					<div class="space-y-10">
						<div>
							<p class="text-xs text-green-400/80 font-medium tracking-[0.4em] uppercase mb-1">Paso {currentStep}</p>
							<h2 class="text-xl font-extralight tracking-widest text-white">Tu grupo de viaje</h2>
							<div class="w-8 h-px bg-white/20 mt-3"></div>
						</div>

						<!-- Adultos -->
						<div class="space-y-4">
							<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Número de adultos</label>
							<div class="flex items-center gap-6">
								<button
									type="button"
									on:click={() => formData.adultos = Math.max(1, formData.adultos - 1)}
									class="w-10 h-10 border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 transition-all flex items-center justify-center text-lg font-extralight"
									aria-label="Reducir adultos"
								>−</button>
								<span class="text-3xl font-extralight text-white w-12 text-center tabular-nums">{formData.adultos}</span>
								<button
									type="button"
									on:click={() => formData.adultos = Math.min(20, formData.adultos + 1)}
									class="w-10 h-10 border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 transition-all flex items-center justify-center text-lg font-extralight"
									aria-label="Aumentar adultos"
								>+</button>
							</div>
						</div>

						<!-- Menores (check toggle) -->
						<div class="space-y-4">
							<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Menores de edad</label>
							<button
								type="button"
								on:click={() => { formData.llevaMenores = !formData.llevaMenores; if (!formData.llevaMenores) { formData.cantidadMenores = 0; formData.edadesMenores = []; } }}
								class="flex items-center gap-3 group"
								aria-pressed={formData.llevaMenores}
							>
								<div class="w-10 h-5 relative rounded-full transition-colors duration-300 {formData.llevaMenores ? 'bg-white/30' : 'bg-white/10'}">
									<div class="absolute top-0.5 transition-all duration-300 w-4 h-4 bg-white rounded-full shadow-sm {formData.llevaMenores ? 'left-5' : 'left-0.5'}"></div>
								</div>
								<span class="text-xs font-light tracking-widest text-white/70 group-hover:text-white/90 transition-colors">
									{formData.llevaMenores ? 'Sí, viajan menores' : 'No viajan menores'}
								</span>
							</button>

							{#if formData.llevaMenores}
								<div class="ml-0 mt-4 space-y-5 border-l border-white/10 pl-6">
									<div class="space-y-2">
										<label class="block text-xs text-white/30 font-extralight tracking-[0.3em] uppercase">Cantidad de menores</label>
										<div class="flex items-center gap-6">
											<button
												type="button"
												on:click={() => { formData.cantidadMenores = Math.max(0, (parseInt(formData.cantidadMenores) || 0) - 1); updateEdadesMenores(); }}
												class="w-10 h-10 border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 transition-all flex items-center justify-center text-lg font-extralight"
												aria-label="Reducir menores"
											>−</button>
											<span class="text-3xl font-extralight text-white w-12 text-center tabular-nums">{formData.cantidadMenores}</span>
											<button
												type="button"
												on:click={() => { formData.cantidadMenores = Math.min(15, (parseInt(formData.cantidadMenores) || 0) + 1); updateEdadesMenores(); }}
												class="w-10 h-10 border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 transition-all flex items-center justify-center text-lg font-extralight"
												aria-label="Aumentar menores"
											>+</button>
										</div>
									</div>

									{#if formData.edadesMenores.length > 0}
										<div class="space-y-2">
											<p class="text-xs text-white/30 font-extralight tracking-[0.3em] uppercase">Edades</p>
											<div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
												{#each formData.edadesMenores as _, i}
													<div class="flex flex-col gap-1">
														<span class="text-[10px] text-white/20 font-extralight tracking-widest">Menor {i + 1}</span>
														<input
															type="number"
															bind:value={formData.edadesMenores[i]}
															placeholder="Edad"
															min="0"
															max="17"
															class="bg-transparent border border-white/10 px-3 py-2 text-white text-sm font-extralight text-center focus:border-white/30 focus:outline-none transition-colors w-full"
														>
													</div>
												{/each}
											</div>
										</div>
									{/if}
								</div>
							{/if}
						</div>

						<!-- Vehículo de renta (condicional) -->
						{#if showVehiculoRenta}
							<div class="space-y-4">
								<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Vehículo de renta</label>
								<p class="text-xs text-white/50 font-light leading-relaxed -mt-2">¿Estarían dispuestos a viajar en vehículo de renta que ustedes mismos manejen?</p>
								<div class="flex gap-4">
									{#each [{ value: true, label: 'Sí, podemos manejar' }, { value: false, label: 'No, preferimos chofer' }] as opt}
										<button
											type="button"
											on:click={() => formData.vehiculoRenta = opt.value}
											class="flex-1 py-3 px-4 border text-xs font-light tracking-widest transition-all {formData.vehiculoRenta === opt.value ? 'border-white/50 bg-white/10 text-white/90' : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20'}"
										>
											{opt.label}
										</button>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Tipo de viaje -->
						<div class="space-y-4">
							<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Tipo de viaje</label>
							<div class="grid grid-cols-3 gap-3">
								{#each ['Familiar', 'Amigos', 'Corporativo'] as tipo}
									<button
										type="button"
										on:click={() => formData.tipoViaje = tipo}
										class="py-4 border text-xs font-light tracking-[0.2em] uppercase transition-all {formData.tipoViaje === tipo ? 'border-white/50 bg-white/10 text-white/90' : 'border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/60'}"
									>
										{tipo}
									</button>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- PASO 2: Destino y Fechas -->
				{#if currentStep === 2}
					<div class="space-y-10">
						<div>
							<p class="text-xs text-green-400/80 font-medium tracking-[0.4em] uppercase mb-1">Paso {currentStep}</p>
							<h2 class="text-xl font-extralight tracking-widest text-white">Destino y fechas</h2>
							<div class="w-8 h-px bg-white/20 mt-3"></div>
						</div>

						<div class="space-y-3">
							<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Destino de interés</label>
							<select
								bind:value={formData.destinos}
								class="w-full bg-transparent border border-white/10 px-4 py-3 text-white/80 font-light text-sm focus:border-white/40 focus:outline-none transition-colors appearance-none"
							>
								<option value="" class="bg-black">Selecciona un destino</option>
								{#each ubicaciones as ubicacion}
									<option value={ubicacion.nombre_ubicacion} class="bg-black">{ubicacion.nombre_ubicacion}</option>
								{/each}
							</select>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="space-y-3">
								<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Salida de Chihuahua</label>
								<input
									type="date"
									bind:value={formData.fechaSalida}
								class="w-full bg-transparent border border-white/10 px-4 py-3 text-white/80 font-light text-sm focus:border-white/40 focus:outline-none transition-colors"
								>
							</div>
							<div class="space-y-3">
								<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Regreso a Chihuahua</label>
								<input
									type="date"
									bind:value={formData.fechaLlegada}
								class="w-full bg-transparent border border-white/10 px-4 py-3 text-white/80 font-light text-sm focus:border-white/40 focus:outline-none transition-colors"
								>
							</div>
						</div>
					</div>
				{/if}

				<!-- PASO 3: Preferencias -->
				{#if currentStep === 3}
					<div class="space-y-10">
						<div>
							<p class="text-xs text-green-400/80 font-medium tracking-[0.4em] uppercase mb-1">Paso {currentStep}</p>
							<h2 class="text-xl font-extralight tracking-widest text-white">Preferencias</h2>
							<div class="w-8 h-px bg-white/20 mt-3"></div>
						</div>

						<!-- Hospedaje -->
						<div class="space-y-4">
							<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Hospedaje</label>
							<div class="grid grid-cols-3 gap-3">
								{#each [{ value: 'hotel', label: 'Hotel' }, { value: 'cabaña', label: 'Cabaña' }, { value: 'indistinto', label: 'Indistinto' }] as h}
									<button
										type="button"
										on:click={() => formData.hospedaje = h.value}
										class="py-4 border text-xs font-light tracking-[0.2em] uppercase transition-all {formData.hospedaje === h.value ? 'border-white/50 bg-white/10 text-white/90' : 'border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/60'}"
									>
										{h.label}
									</button>
								{/each}
							</div>
						</div>

						<!-- Transporte -->
						<div class="space-y-3">
							<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Transporte</label>
							<select
								bind:value={formData.transporte}
								class="w-full bg-transparent border border-white/10 px-4 py-3 text-white/80 font-light text-sm focus:border-white/40 focus:outline-none transition-colors appearance-none"
							>
								<option value="" class="bg-black">Selecciona una opción</option>
								<option value="privado" class="bg-black">Transporte privado con chofer</option>
								<option value="compartido" class="bg-black">Transporte compartido</option>
								<option value="aeropuerto" class="bg-black">Solo traslado desde aeropuerto</option>
								<option value="sin-transporte" class="bg-black">No requiero transporte</option>
							</select>
						</div>

						<!-- Experiencias -->
						<div class="space-y-4">
							<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Tipo de experiencias</label>
							<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
								{#each [{ value: 'aventura', label: 'Aventura' }, { value: 'naturaleza', label: 'Naturaleza' }, { value: 'cultura', label: 'Cultura' }, { value: 'relax', label: 'Relax' }] as exp}
									<button
										type="button"
										on:click={() => toggleExperiencia(exp.value)}
										class="py-4 border text-xs font-light tracking-[0.2em] uppercase transition-all {formData.experiencias.includes(exp.value) ? 'border-white/50 bg-white/10 text-white/90' : 'border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/60'}"
									>
										{exp.label}
									</button>
								{/each}
							</div>
						</div>

						<!-- Presupuesto -->
						<div class="space-y-3">
							<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Presupuesto aproximado (MXN por persona)</label>
							<select
								bind:value={formData.presupuesto}
								class="w-full bg-transparent border border-white/10 px-4 py-3 text-white/80 font-light text-sm focus:border-white/40 focus:outline-none transition-colors appearance-none"
							>
								<option value="" class="bg-black">Selecciona un rango</option>
								<option value="5000-10000" class="bg-black">$5,000 — $10,000</option>
								<option value="10000-15000" class="bg-black">$10,000 — $15,000</option>
								<option value="15000-20000" class="bg-black">$15,000 — $20,000</option>
								<option value="20000-30000" class="bg-black">$20,000 — $30,000</option>
								<option value="30000+" class="bg-black">$30,000+</option>
								<option value="flexible" class="bg-black">Flexible / Por definir</option>
							</select>
						</div>
					</div>
				{/if}

				<!-- PASO 4: Contacto -->
				{#if currentStep === 4}
					<div class="space-y-10">
						<div>
							<p class="text-xs text-green-400/80 font-medium tracking-[0.4em] uppercase mb-1">Paso {currentStep}</p>
							<h2 class="text-xl font-extralight tracking-widest text-white">Información de contacto</h2>
							<div class="w-8 h-px bg-white/20 mt-3"></div>
						</div>

						<div class="space-y-6">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div class="space-y-2">
									<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Nombre completo</label>
									<input
										type="text"
										maxlength="45"
										bind:value={formData.nombre}
										placeholder="Tu nombre"
										class="w-full bg-transparent border border-white/10 px-4 py-3 text-white/80 font-light text-sm placeholder-white/40 focus:border-white/40 focus:outline-none transition-colors"
									>
								</div>
								<div class="space-y-2">
									<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Email</label>
									<input
										type="email"
										maxlength="35"
										bind:value={formData.email}
										placeholder="tu@email.com"
										class="w-full bg-transparent border border-white/10 px-4 py-3 text-white/80 font-light text-sm placeholder-white/40 focus:border-white/40 focus:outline-none transition-colors"
									>
								</div>
							</div>

							<div class="space-y-2">
								<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Teléfono</label>
								<input
									type="tel"
									bind:value={formData.telefono}
									placeholder="+52 614 000 0000"
									class="w-full bg-transparent border border-white/10 px-4 py-3 text-white/70 font-extralight text-sm placeholder-white/15 focus:border-white/30 focus:outline-none transition-colors"
								>
							</div>

							<div class="space-y-2">
								<label class="block text-xs text-white/60 font-medium tracking-[0.3em] uppercase">Comentarios adicionales</label>
								<textarea
									bind:value={formData.comentarios}
									placeholder="Información adicional que consideres importante..."
									rows="3"
									class="w-full bg-transparent border border-white/10 px-4 py-3 text-white/80 font-light text-sm placeholder-white/40 focus:border-white/40 focus:outline-none transition-colors resize-none"
								></textarea>
							</div>
						</div>

						<!-- Resumen -->
						<div class="border border-white/10 p-6 space-y-3">
							<p class="text-xs text-green-400/70 font-medium tracking-[0.4em] uppercase mb-4">Resumen de solicitud</p>
							<div class="grid grid-cols-2 gap-x-8 gap-y-2">
								<div class="flex justify-between col-span-2 sm:col-span-1">
									<span class="text-xs text-white/50 font-light">Viajeros</span>
									<span class="text-xs text-white/80 font-medium">{formData.adultos} adultos{formData.llevaMenores && formData.cantidadMenores > 0 ? ` + ${formData.cantidadMenores} menores` : ''}</span>
								</div>
								<div class="flex justify-between col-span-2 sm:col-span-1">
									<span class="text-xs text-white/50 font-light">Tipo</span>
									<span class="text-xs text-white/80 font-medium">{formData.tipoViaje || '—'}</span>
								</div>
								<div class="flex justify-between col-span-2 sm:col-span-1">
									<span class="text-xs text-white/50 font-light">Destino</span>
									<span class="text-xs text-white/80 font-medium">{formData.destinos || '—'}</span>
								</div>
								<div class="flex justify-between col-span-2 sm:col-span-1">
									<span class="text-xs text-white/50 font-light">Hospedaje</span>
									<span class="text-xs text-white/80 font-medium">{formData.hospedaje || '—'}</span>
								</div>
								<div class="flex justify-between col-span-2 sm:col-span-1">
									<span class="text-xs text-white/50 font-light">Presupuesto</span>
									<span class="text-xs text-white/80 font-medium">{formData.presupuesto || '—'}</span>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Botones de navegación -->
				<div class="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
					{#if currentStep > 1}
						<button
							type="button"
							on:click={prevStep}
							class="flex items-center gap-2 px-5 py-3 border border-white/20 bg-white/[0.02] hover:bg-white/5 text-white/60 hover:text-white/80 text-xs font-light tracking-[0.3em] uppercase transition-all"
						>
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"></path>
							</svg>
							Anterior
						</button>
					{:else}
						<div></div>
					{/if}

					{#if currentStep < totalSteps}
						<button
							type="button"
							on:click={nextStep}
							class="flex items-center gap-2 px-6 py-3 border border-white/30 bg-white/10 hover:bg-white/15 text-white/80 hover:text-white/100 text-xs font-medium tracking-[0.3em] uppercase transition-all"
						>
							Siguiente
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"></path>
							</svg>
						</button>
					{:else}
						<div class="flex items-center gap-4">
							<button
								type="button"
								on:click={() => { cleanForm(); goToStep(1); }}
								class="flex items-center gap-2 px-5 py-3 border border-white/10 bg-transparent hover:bg-white/5 text-white/50 hover:text-white/70 text-xs font-light tracking-[0.3em] uppercase transition-all"
							>
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
								</svg>
								Reiniciar
							</button>
							<button
								type="button"
								on:click={submitForm}
								class="flex items-center gap-2 px-8 py-3 border border-white/40 bg-white/15 hover:bg-white/20 text-white/90 hover:text-white/100 text-xs font-medium tracking-[0.3em] uppercase transition-all"
							>
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
								</svg>
								Solicitar cotización
							</button>
						</div>
					{/if}
				</div>

			</div>
		</div>
	</section>
</div>
