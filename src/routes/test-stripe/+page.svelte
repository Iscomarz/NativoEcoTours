<script>
	import StripePayment from '$lib/components/pagos/StripePayment.svelte';
	
	let testAmount = 500.00; // Monto en pesos mexicanos
	let paymentResult = null;
	let showPayment = true;
	
	function handlePaymentSuccess(paymentIntent) {
		console.log('✅ Pago exitoso:', paymentIntent);
		paymentResult = {
			success: true,
			data: paymentIntent
		};
		showPayment = false;
	}
	
	function handlePaymentError(error) {
		console.error('❌ Error en pago:', error);
		paymentResult = {
			success: false,
			error: error
		};
	}
	
	function resetTest() {
		paymentResult = null;
		showPayment = true;
	}
</script>

<svelte:head>
	<title>Test Stripe Integration - NativoEcoTours</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-white mb-4">
				🧪 Test de Integración Stripe
			</h1>
			<p class="text-gray-400 max-w-2xl mx-auto">
				Esta página te permite probar la integración de Stripe sin necesidad de crear una reserva completa.
				Usa las tarjetas de prueba de Stripe para verificar el funcionamiento.
			</p>
		</div>
		
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Panel de Control -->
			<div class="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
				<h2 class="text-xl font-bold text-white mb-4 flex items-center">
					⚙️ Control de Pruebas
				</h2>
				
				<div class="space-y-4">
					<div>
						<label for="test-amount" class="block text-sm font-medium text-gray-300 mb-2">
							Monto a probar (MXN)
						</label>
						<input
							id="test-amount"
							type="number"
							bind:value={testAmount}
							min="0.50"
							step="0.01"
							class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"
							disabled={!showPayment}
						/>
					</div>
					
					{#if !showPayment}
						<button
							on:click={resetTest}
							class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
						>
							🔄 Nuevo Test
						</button>
					{/if}
				</div>
				
				<!-- Tarjetas de prueba -->
				<div class="mt-6 p-4 bg-neutral-700/50 rounded-lg">
					<h3 class="font-semibold text-white mb-2">🃏 Tarjetas de Prueba</h3>
					<div class="text-sm space-y-2">
						<div>
							<span class="text-green-400">✅ Éxito:</span>
							<code class="text-gray-300">4242 4242 4242 4242</code>
						</div>
						<div>
							<span class="text-red-400">❌ Falla:</span>
							<code class="text-gray-300">4000 0000 0000 0002</code>
						</div>
						<div>
							<span class="text-yellow-400">🔒 3D Secure:</span>
							<code class="text-gray-300">4000 0025 0000 3155</code>
						</div>
					</div>
					<p class="text-xs text-gray-500 mt-2">
						CVV: cualquier 3 dígitos • Fecha: cualquier fecha futura
					</p>
				</div>
			</div>
			
			<!-- Componente de Pago -->
			<div class="lg:col-span-2">
				{#if showPayment}
					<StripePayment 
						amount={testAmount}
						currency="mxn"
						metadata={{
							test: true,
							timestamp: new Date().toISOString(),
							test_amount: testAmount
						}}
						onPaymentSuccess={handlePaymentSuccess}
						onPaymentError={handlePaymentError}
					/>
				{:else if paymentResult}
					<!-- Resultado del pago -->
					<div class="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
						{#if paymentResult.success}
							<div class="text-center">
								<div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
									<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
									</svg>
								</div>
								<h3 class="text-2xl font-bold text-white mb-2">¡Pago Exitoso! ✅</h3>
								<p class="text-gray-400 mb-6">El pago se procesó correctamente</p>
								
								<div class="bg-neutral-700/50 rounded-lg p-4 text-left">
									<h4 class="font-semibold text-white mb-2">Detalles del Pago:</h4>
									<div class="space-y-1 text-sm">
										<div class="flex justify-between">
											<span class="text-gray-400">ID:</span>
											<code class="text-green-400">{paymentResult.data.id}</code>
										</div>
										<div class="flex justify-between">
											<span class="text-gray-400">Estado:</span>
											<span class="text-green-400">{paymentResult.data.status}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-gray-400">Monto:</span>
											<span class="text-white">${(paymentResult.data.amount / 100).toFixed(2)} {paymentResult.data.currency.toUpperCase()}</span>
										</div>
									</div>
								</div>
							</div>
						{:else}
							<div class="text-center">
								<div class="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
									<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
									</svg>
								</div>
								<h3 class="text-2xl font-bold text-white mb-2">Error en el Pago ❌</h3>
								<p class="text-gray-400 mb-6">Hubo un problema al procesar el pago</p>
								
								<div class="bg-red-900/20 border border-red-800 rounded-lg p-4 text-left">
									<h4 class="font-semibold text-red-400 mb-2">Error:</h4>
									<p class="text-red-300 text-sm">{paymentResult.error.message}</p>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
		
		<!-- Información adicional -->
		<div class="mt-12 bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
			<h2 class="text-lg font-bold text-white mb-4">ℹ️ Información del Test</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
				<div>
					<h3 class="font-semibold text-green-400 mb-2">✅ Funcionalidades probadas:</h3>
					<ul class="space-y-1 text-gray-300">
						<li>• Creación de Payment Intent</li>
						<li>• Validación de formulario</li>
						<li>• Procesamiento de pago</li>
						<li>• Manejo de errores</li>
						<li>• Estados de pago</li>
						<li>• Interfaz responsive</li>
					</ul>
				</div>
				<div>
					<h3 class="font-semibold text-blue-400 mb-2">🔗 Endpoints utilizados:</h3>
					<ul class="space-y-1 text-gray-300">
						<li>• <code>/api/payments/create-intent</code></li>
						<li>• <code>/api/payments/confirm</code></li>
						<li>• <code>/api/payments/webhook</code> (background)</li>
					</ul>
				</div>
			</div>
		</div>
		
		<!-- Navegación -->
		<div class="mt-8 text-center">
			<a 
				href="/checkout" 
				class="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mr-4"
			>
				🛒 Ir al Checkout Real
			</a>
			<a 
				href="/" 
				class="inline-flex items-center px-6 py-3 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
			>
				🏠 Volver al Inicio
			</a>
		</div>
	</div>
</div>

<style>
	code {
		font-family: 'Courier New', monospace;
		font-size: 0.85em;
	}
</style>