<script>
	import { onMount } from 'svelte';

	export let data;
	$: ubicaciones = data.ubicaciones || [];
	
	let scrollY = 0;
	
	// Form data
	let formData = {
		adultos: 2,
		menores: [],
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
	
	let nuevoMenor = { edad: '', nombre: '' };
	let currentStep = 1;
	const totalSteps = 4;
	
	onMount(() => {
		const handleScroll = () => scrollY = window.scrollY;
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
	
	function agregarMenor() {
		if (nuevoMenor.edad && nuevoMenor.nombre) {
			formData.menores = [...formData.menores, { ...nuevoMenor }];
			nuevoMenor = { edad: '', nombre: '' };
		}
	}
	
	function removerMenor(index) {
		formData.menores = formData.menores.filter((_, i) => i !== index);
	}
	
	function toggleExperiencia(experiencia) {
		if (formData.experiencias.includes(experiencia)) {
			formData.experiencias = formData.experiencias.filter(exp => exp !== experiencia);
		} else {
			formData.experiencias = [...formData.experiencias, experiencia];
		}
	}
	
	function nextStep() {
		// Validaciones por paso
		if (currentStep === 1) {
			// Validar vehículo de renta si aplica
			if (showVehiculoRenta && formData.vehiculoRenta === null) {
				alert('Por favor indica si estarían dispuestos a viajar en vehículo de renta.');
				return;
			}
		}
		
		if (currentStep === 2) {
			// Validar destino de interés
			if (!formData.destinos) {
				alert('Por favor selecciona un destino de interés.');
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
			menores: [],
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
		if (step >= 1 && step <= totalSteps) {
			currentStep = step;
		}
	}
	
	function submitForm() {
		// Validar campos requeridos
		if (!formData.nombre || !formData.email || !formData.telefono) {
			alert('Por favor completa los campos de Nombre, Email y Teléfono.');
			return;
		}
		
		// Validar formato de email básico
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			alert('Por favor ingresa un email válido.');
			return;
		}
		
		// Generar mensaje para WhatsApp
		const menoresTexto = formData.menores.length > 0 
			? formData.menores.map(m => `  - ${m.nombre} (${m.edad} años)`).join('\n')
			: '  Ninguno';

		const mensaje = `
🌿 *NUEVA SOLICITUD DE COTIZACIÓN - NATIVO ECO TOURS* 🌿

━━━━━━━━━━━━━━━━━━━━━
👥 *GRUPO DE VIAJE*
━━━━━━━━━━━━━━━━━━━━━
• Adultos: ${formData.adultos}
• Menores: ${formData.menores.length}
${menoresTexto}
• Tipo de viaje: ${formData.tipoViaje || 'No especificado'}
${formData.vehiculoRenta !== null ? `• Vehículo de renta: ${formData.vehiculoRenta ? 'Sí, pueden manejar' : 'No, prefieren chofer'}` : ''}

━━━━━━━━━━━━━━━━━━━━━
📍 *DESTINO Y FECHAS*
━━━━━━━━━━━━━━━━━━━━━
• Destino: ${formData.destinos || 'No especificado'}
• Llegada: ${formData.fechaLlegada || 'Por definir'}
• Salida: ${formData.fechaSalida || 'Por definir'}

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

		// Generar URL de WhatsApp
		const numeroWhatsApp = '5216146029050';
		const mensajeCodificado = encodeURIComponent(mensaje);
		const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
		
		// Abrir WhatsApp en nueva ventana
		window.open(urlWhatsApp, '_blank');
		
		// Mostrar mensaje de confirmación
		alert('¡Redirigiendo a WhatsApp! Envía el mensaje para completar tu solicitud de cotización.');
		cleanForm();
		goToStep(1);
	}
	
	$: showVehiculoRenta = formData.adultos + formData.menores.length < 7;
</script>

<svelte:window bind:scrollY />

<div class="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 mt-20">
	<!-- Hero Section -->
	<section class="relative h-96 overflow-hidden">
		<!-- Background Image con Parallax -->
		<div 
			class="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110"
			style="background-image: url('/path/to/cotizacion-hero.jpg'); transform: translateY({scrollY * 0.3}px) scale(1.1);"
		>
			<div class="absolute inset-0 bg-black/70"></div>
		</div>
		
		<!-- Hero Content -->
		<div class="relative z-10 flex items-center justify-center h-full text-center px-6">
			<div class="max-w-4xl mx-auto space-y-6">
				<div class="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
					<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
					</svg>
				</div>
				
				<h1 class="text-5xl md:text-6xl font-bold text-white leading-tight">
					<span class="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
						Cotización
					</span>
					<br>
					<span class="text-white text-3xl md:text-4xl font-normal">Personalizada</span>
				</h1>
				
				<p class="text-xl text-gray-200 max-w-2xl mx-auto">
					Cuéntanos sobre tu viaje ideal y crearemos una experiencia única para ti
				</p>
			</div>
		</div>
	</section>

	<!-- Progress Bar -->
	<div class="sticky top-24 z-40 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-700">
		<div class="max-w-4xl mx-auto px-6 py-4">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm font-medium text-green-400">Paso {currentStep} de {totalSteps}</span>
				<span class="text-sm text-gray-400">{Math.round((currentStep / totalSteps) * 100)}% completado</span>
			</div>
			<div class="w-full bg-neutral-700 rounded-full h-2">
				<div 
					class="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
					style="width: {(currentStep / totalSteps) * 100}%"
				></div>
			</div>
		</div>
	</div>

	<!-- Form Content -->
	<section class="py-12 px-6">
		<div class="max-w-4xl mx-auto">
			<div class="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-neutral-700/50">
				
				<!-- Step 1: Grupo de Viaje -->
				{#if currentStep === 1}
					<div class="space-y-8">
						<div class="text-center mb-8">
							<h2 class="text-3xl font-bold text-white mb-4">Cuéntanos sobre tu grupo</h2>
							<p class="text-gray-300">Información básica sobre los viajeros</p>
						</div>

						<!-- Número de Adultos -->
						<div class="space-y-4">
							<label class="block text-lg font-semibold text-green-400">Número de Adultos</label>
							<div class="flex items-center space-x-4">
								<button 
									type="button"
									on:click={() => formData.adultos = Math.max(1, formData.adultos - 1)}
									class="w-12 h-12 bg-neutral-700 hover:bg-neutral-600 text-white rounded-full flex items-center justify-center transition-colors"
								>-</button>
								<span class="text-2xl font-bold text-white w-16 text-center">{formData.adultos}</span>
								<button 
									type="button"
									on:click={() => formData.adultos = Math.min(20, formData.adultos + 1)}
									class="w-12 h-12 bg-neutral-700 hover:bg-neutral-600 text-white rounded-full flex items-center justify-center transition-colors"
								>+</button>
							</div>
						</div>

						<!-- Menores -->
						<div class="space-y-4">
							<label class="block text-lg font-semibold text-green-400">Menores de Edad</label>
							
							<!-- Lista de menores -->
							{#if formData.menores.length > 0}
								<div class="space-y-2 mb-4">
									{#each formData.menores as menor, index}
										<div class="flex items-center justify-between bg-neutral-700/50 p-3 rounded-lg">
											<span class="text-white">{menor.nombre} - {menor.edad} años</span>
											<button 
												type="button"
												on:click={() => removerMenor(index)}
												class="text-red-400 hover:text-red-300 transition-colors"
											>
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
												</svg>
											</button>
										</div>
									{/each}
								</div>
							{/if}

							<!-- Agregar menor -->
							<div class="flex space-x-3">
								<input 
									type="text"
									bind:value={nuevoMenor.nombre}
									placeholder="Nombre del menor"
									class="flex-1 bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
								>
								<input 
									type="number"
									bind:value={nuevoMenor.edad}
									placeholder="Edad"
									min="0"
									max="17"
									class="w-24 bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
								>
								<button 
									type="button"
									on:click={agregarMenor}
									class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
								>
									Agregar
								</button>
							</div>
						</div>

						<!-- Vehículo de Renta (condicional) -->
						{#if showVehiculoRenta}
							<div class="space-y-4 p-6 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-700/30">
								<label class="block text-lg font-semibold text-blue-400">
									¿Estarían dispuestos a viajar en vehículo de renta que ustedes mismos manejen?
								</label>
								<div class="flex space-x-4">
									<label class="flex items-center space-x-3 cursor-pointer">
										<input 
											type="radio" 
											bind:group={formData.vehiculoRenta} 
											value={true}
											class="w-5 h-5 text-green-500"
										>
										<span class="text-white">Sí, podemos manejar</span>
									</label>
									<label class="flex items-center space-x-3 cursor-pointer">
										<input 
											type="radio" 
											bind:group={formData.vehiculoRenta} 
											value={false}
											class="w-5 h-5 text-green-500"
										>
										<span class="text-white">No, preferimos chofer</span>
									</label>
								</div>
							</div>
						{/if}

						<!-- Tipo de Viaje -->
						<div class="space-y-4">
							<label class="block text-lg font-semibold text-green-400">Tipo de Viaje</label>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								{#each ['Familiar', 'Amigos', 'Corporativo'] as tipo}
									<label class="relative cursor-pointer">
										<input 
											type="radio" 
											bind:group={formData.tipoViaje} 
											value={tipo}
											class="sr-only"
										>
										<div class="p-4 border-2 rounded-lg transition-all {formData.tipoViaje === tipo ? 'border-green-500 bg-green-500/10' : 'border-neutral-600 hover:border-green-400'}">
											<div class="text-center">
												<div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br {formData.tipoViaje === tipo ? 'from-green-400 to-emerald-600' : 'from-neutral-600 to-neutral-700'} rounded-full flex items-center justify-center">
													{#if tipo === 'Familiar'}
														<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
														</svg>
													{:else if tipo === 'Amigos'}
														<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m0 0a6.01 6.01 0 005.83 4.747M13 14a3 3 0 11-6 0 3 3 0 016 0z"></path>
														</svg>
													{:else}
														<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
														</svg>
													{/if}
												</div>
												<span class="font-medium {formData.tipoViaje === tipo ? 'text-green-400' : 'text-white'}">{tipo}</span>
											</div>
										</div>
									</label>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- Step 2: Destino y Fechas -->
				{#if currentStep === 2}
					<div class="space-y-8">
						<div class="text-center mb-8">
							<h2 class="text-3xl font-bold text-white mb-4">Destino y fechas</h2>
							<p class="text-gray-300">¿Cuándo y dónde te gustaría viajar?</p>
						</div>

						<!-- Destinos -->
						<div class="space-y-4">
							<label class="block text-lg font-semibold text-green-400">Destino de Interés</label>
							<select 
								bind:value={formData.destinos}
								class="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
							>
								<option value="">Selecciona un destino</option>
								{#each ubicaciones as ubicacion}
									<option value={ubicacion.nombre_ubicacion}>
										{ubicacion.nombre_ubicacion}
									</option>
								{/each}
							</select>
						</div>

						<!-- Fechas -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							
							<div class="space-y-4">
								<label class="block text-lg font-semibold text-green-400">Salida de Chihuahua Capital</label>
								<input 
									type="date"
									bind:value={formData.fechaSalida}
									class="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
								>
							</div>
							<div class="space-y-4">
								<label class="block text-lg font-semibold text-green-400">Llegada a Chihuahua Capital</label>
								<input 
									type="date"
									bind:value={formData.fechaLlegada}
									class="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
								>
							</div>
						</div>
					</div>
				{/if}

				<!-- Step 3: Preferencias -->
				{#if currentStep === 3}
					<div class="space-y-8">
						<div class="text-center mb-8">
							<h2 class="text-3xl font-bold text-white mb-4">Tus preferencias</h2>
							<p class="text-gray-300">Personaliza tu experiencia</p>
						</div>

						<!-- Hospedaje -->
						<div class="space-y-4">
							<label class="block text-lg font-semibold text-green-400">Hospedaje Preferido</label>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								{#each [
									{ value: 'hotel', name: 'Hotel', icon: 'M19 7h3v12h-3M8 21l-2-6h12l-2 6M16 3v4M8 3v4m0 0V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7h8' },
									{ value: 'cabaña', name: 'Cabaña', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
									{ value: 'indistinto', name: 'Indistinto', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
								] as hospedaje}
									<label class="relative cursor-pointer">
										<input 
											type="radio" 
											bind:group={formData.hospedaje} 
											value={hospedaje.value}
											class="sr-only"
										>
										<div class="p-4 border-2 rounded-lg transition-all {formData.hospedaje === hospedaje.value ? 'border-green-500 bg-green-500/10' : 'border-neutral-600 hover:border-green-400'}">
											<div class="text-center">
												<div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br {formData.hospedaje === hospedaje.value ? 'from-green-400 to-emerald-600' : 'from-neutral-600 to-neutral-700'} rounded-full flex items-center justify-center">
													<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={hospedaje.icon}></path>
													</svg>
												</div>
												<span class="font-medium {formData.hospedaje === hospedaje.value ? 'text-green-400' : 'text-white'}">{hospedaje.name}</span>
											</div>
										</div>
									</label>
								{/each}
							</div>
						</div>

						<!-- Transporte -->
						<div class="space-y-4">
							<label class="block text-lg font-semibold text-green-400">Transporte</label>
							<select 
								bind:value={formData.transporte}
								class="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
							>
								<option value="">Selecciona una opción</option>
								<option value="privado">Transporte privado con chofer</option>
								<option value="compartido">Transporte compartido</option>
								<option value="aeropuerto">Solo traslado desde aeropuerto</option>
								<option value="sin-transporte">No requiero transporte</option>
							</select>
						</div>

						<!-- Experiencias -->
						<div class="space-y-4">
							<label class="block text-lg font-semibold text-green-400">Tipo de Experiencias que Buscan</label>
							<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
								{#each [
									{ value: 'aventura', name: 'Aventura', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
									{ value: 'naturaleza', name: 'Naturaleza', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
									{ value: 'cultura', name: 'Cultura', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
									{ value: 'relax', name: 'Relax', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }
								] as experiencia}
									<label class="relative cursor-pointer">
										<input 
											type="checkbox" 
											checked={formData.experiencias.includes(experiencia.value)}
											on:change={() => toggleExperiencia(experiencia.value)}
											class="sr-only"
										>
										<div class="p-4 border-2 rounded-lg transition-all {formData.experiencias.includes(experiencia.value) ? 'border-green-500 bg-green-500/10' : 'border-neutral-600 hover:border-green-400'}">
											<div class="text-center">
												<div class="w-10 h-10 mx-auto mb-2 bg-gradient-to-br {formData.experiencias.includes(experiencia.value) ? 'from-green-400 to-emerald-600' : 'from-neutral-600 to-neutral-700'} rounded-full flex items-center justify-center">
													<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={experiencia.icon}></path>
													</svg>
												</div>
												<span class="text-sm font-medium {formData.experiencias.includes(experiencia.value) ? 'text-green-400' : 'text-white'}">{experiencia.name}</span>
											</div>
										</div>
									</label>
								{/each}
							</div>
						</div>

						<!-- Presupuesto -->
						<div class="space-y-4">
							<label class="block text-lg font-semibold text-green-400">Presupuesto Aproximado (MXN por persona)</label>
							<select 
								bind:value={formData.presupuesto}
								class="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
							>
								<option value="">Selecciona un rango</option>
								<option value="5000-10000">$5,000 - $10,000</option>
								<option value="10000-15000">$10,000 - $15,000</option>
								<option value="15000-20000">$15,000 - $20,000</option>
								<option value="20000-30000">$20,000 - $30,000</option>
								<option value="30000+">$30,000+</option>
								<option value="flexible">Flexible / Por definir</option>
							</select>
						</div>
					</div>
				{/if}

				<!-- Step 4: Contacto -->
				{#if currentStep === 4}
					<div class="space-y-8">
						<div class="text-center mb-8">
							<h2 class="text-3xl font-bold text-white mb-4">Información de contacto</h2>
							<p class="text-gray-300">Para enviarte tu cotización personalizada</p>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="space-y-4">
								<label class="block text-lg font-semibold text-green-400">Nombre Completo</label>
								<input 
									type="text"
									bind:value={formData.nombre}
									placeholder="Tu nombre completo"
									class="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
								>
							</div>
							<div class="space-y-4">
								<label class="block text-lg font-semibold text-green-400">Email</label>
								<input 
									type="email"
									bind:value={formData.email}
									placeholder="tu@email.com"
									class="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
								>
							</div>
						</div>

						<div class="space-y-4">
							<label class="block text-lg font-semibold text-green-400">Teléfono</label>
							<input 
								type="tel"
								bind:value={formData.telefono}
								placeholder="+52 614 123 4567"
								class="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
							>
						</div>

						<div class="space-y-4">
							<label class="block text-lg font-semibold text-green-400">Comentarios Adicionales</label>
							<textarea 
								bind:value={formData.comentarios}
								placeholder="Cualquier información adicional que consideres importante..."
								rows="4"
								class="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors resize-none"
							></textarea>
						</div>

						<!-- Resumen -->
						<div class="mt-8 p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg border border-green-700/30">
							<h3 class="text-xl font-semibold text-green-400 mb-4">Resumen de tu solicitud</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div class="space-y-2">
									<p class="text-gray-300"><span class="text-white font-medium">Viajeros:</span> {formData.adultos} adultos + {formData.menores.length} menores</p>
									<p class="text-gray-300"><span class="text-white font-medium">Tipo:</span> {formData.tipoViaje || 'No especificado'}</p>
									<p class="text-gray-300"><span class="text-white font-medium">Fechas:</span> {formData.fechaLlegada || 'N/A'} - {formData.fechaSalida || 'N/A'}</p>
								</div>
								<div class="space-y-2">
									<p class="text-gray-300"><span class="text-white font-medium">Hospedaje:</span> {formData.hospedaje || 'No especificado'}</p>
									<p class="text-gray-300"><span class="text-white font-medium">Transporte:</span> {formData.transporte || 'No especificado'}</p>
									<p class="text-gray-300"><span class="text-white font-medium">Presupuesto:</span> {formData.presupuesto || 'No especificado'}</p>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Navigation Buttons -->
				<div class="flex justify-between items-center mt-12 pt-8 border-t border-neutral-700">
					{#if currentStep > 1}
						<button 
							type="button"
							on:click={prevStep}
							class="flex items-center px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
						>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
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
							class="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
						>
							Siguiente
							<svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
							</svg>
						</button>
					{:else}
						<button 
							type="button"
							on:click={submitForm}
							class="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-xl"
						>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
							</svg>
							Solicitar Cotización
						</button>
					{/if}
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	/* Custom radio and checkbox styling */
	input[type="radio"]:checked + div {
		transform: scale(1.02);
	}
	
	input[type="checkbox"]:checked + div {
		transform: scale(1.02);
	}
</style>
