<script>
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';
	
	export let amount = 0; // Cantidad en pesos mexicanos
	export let currency = 'mxn';
	export let metadata = {};
	export let onPaymentSuccess = () => {};
	export let onPaymentError = () => {};
	
	let stripe = null;
	let elements = null;
	let cardElement = null;
	let clientSecret = null;
	let isLoading = false;
	let paymentError = null;
	let paymentSuccess = false;
	
	// Referencias a elementos del DOM
	let cardElementContainer;
	let paymentForm;
	
	onMount(async () => {
		// Inicializar Stripe
		stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
		
		if (stripe) {
			// Crear elements instance sin configuración personalizada
			elements = stripe.elements();
			
			// Crear el elemento de tarjeta sin código postal - configuración mínima
			cardElement = elements.create('card', {
				hidePostalCode: true, // Solo ocultar código postal
				style: {
					base: {
						color: '#ffffff' // Solo texto blanco para mejor contraste
					}
				}
			});
			
			// Montar el elemento de tarjeta
			cardElement.mount(cardElementContainer);
			
			// Escuchar cambios en el elemento de tarjeta
			cardElement.on('change', ({error}) => {
				if (error) {
					paymentError = error.message;
				} else {
					paymentError = null;
				}
			});
		}
	});
	
	async function createPaymentIntent() {
		try {
			const response = await fetch('/api/payments/create-intent', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					amount,
					currency,
					metadata
				})
			});
			
			const result = await response.json();
			
			if (result.success) {
				clientSecret = result.client_secret;
				return result;
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			throw error;
		}
	}
	
	async function handleSubmit() {
		if (!stripe || !cardElement) {
			paymentError = 'Stripe no está cargado correctamente';
			return;
		}
		
		if (amount <= 0) {
			paymentError = 'El monto debe ser mayor a 0';
			return;
		}
		
		isLoading = true;
		paymentError = null;
		
		try {
			// Crear Payment Intent si no existe
			if (!clientSecret) {
				await createPaymentIntent();
			}
			
			// Confirmar el pago
			const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: cardElement,
					billing_details: {
						// Aquí puedes agregar información del cliente si la tienes
						name: 'Cliente'
					}
				}
			});
			
			if (error) {
				paymentError = error.message;
				onPaymentError(error);
			} else {
				paymentSuccess = true;
				onPaymentSuccess(paymentIntent);
			}
		} catch (error) {
			paymentError = error.message;
			onPaymentError(error);
		} finally {
			isLoading = false;
		}
	}
	
	function resetForm() {
		paymentError = null;
		paymentSuccess = false;
		clientSecret = null;
		if (cardElement) {
			cardElement.clear();
		}
	}
</script>

<div class="payment-container">
	<div class="payment-form-card">
		{#if paymentSuccess}
			<div class="success-message">
				<div class="success-icon">✓</div>
				<h3>¡Pago exitoso!</h3>
				<p>Tu pago ha sido procesado correctamente.</p>
				<button 
					type="button" 
					class="btn-secondary"
					on:click={resetForm}
				>
					Realizar otro pago
				</button>
			</div>
		{:else}
			<div class="payment-header">
				<h3>Información de pago</h3>
				{#if amount > 0}
					<div class="amount-display">
						Total: <span class="amount">${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {currency.toUpperCase()}</span>
					</div>
				{/if}
			</div>
			
			<form bind:this={paymentForm} on:submit|preventDefault={handleSubmit}>
				<div class="form-group">
					<label for="amount">Monto a pagar (Pesos Mexicanos)</label>
					<div class="amount-input-container">
						<input
							type="text"
							id="amount"
							value="${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN"
							readonly
							class="amount-input readonly"
							title="El monto está definido por tu reserva"
						/>
						<div class="readonly-indicator">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
							</svg>
						</div>
					</div>
				</div>
				
				<div class="form-group">
					<label for="card-element">Información de la tarjeta</label>
					<div 
						bind:this={cardElementContainer}
						class="card-element"
					></div>
				</div>
				
				{#if paymentError}
					<div class="error-message">
						{paymentError}
					</div>
				{/if}
				
				<button
					type="submit"
					class="btn-primary payment-button"
					disabled={isLoading || !stripe || amount <= 0}
				>
					{#if isLoading}
						Procesando...
					{:else}
						Pagar ${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
					{/if}
				</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.payment-container {
		max-width: 500px;
		margin: 0 auto;
		padding: 20px;
	}
	
	.payment-form-card {
		background: #262626;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
		padding: 30px;
		border: 1px solid #404040;
	}
	
	.payment-header {
		margin-bottom: 25px;
		text-align: center;
	}
	
	.payment-header h3 {
		color: #ffffff;
		margin: 0 0 10px 0;
		font-size: 24px;
		font-weight: 600;
	}
	
	.amount-display {
		color: #a3a3a3;
		font-size: 16px;
	}
	
	.amount {
		font-weight: bold;
		color: #10b981;
		font-size: 18px;
	}
	
	.form-group {
		margin-bottom: 20px;
	}
	
	.form-group label {
		display: block;
		margin-bottom: 8px;
		color: #d4d4d4;
		font-weight: 500;
		font-size: 14px;
	}
	
	.amount-input-container {
		position: relative;
	}
	
	.amount-input {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid #404040;
		border-radius: 8px;
		font-size: 16px;
		background: #1a1a1a;
		color: #ffffff;
		transition: border-color 0.2s;
	}
	
	.amount-input.readonly {
		background: #171717;
		color: #10b981;
		font-weight: 600;
		cursor: not-allowed;
		border-color: #525252;
		padding-right: 45px;
	}
	
	.readonly-indicator {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: #737373;
		width: 20px;
		height: 20px;
	}
	
	.amount-input:focus {
		outline: none;
		border-color: #10b981;
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
	}
	
	.card-element {
		padding: 12px 16px;
		border: 2px solid #404040;
		border-radius: 8px;
		transition: border-color 0.2s;
		min-height: 44px;
        color: white !important;
	}
	
	.card-element:focus-within {
		border-color: #10b981;
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
	}
	
	.payment-button {
		width: 100%;
		padding: 14px;
		background: #10b981;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.payment-button:hover:not(:disabled) {
		background: #059669;
	}
	
	.payment-button:disabled {
		background: #525252;
		cursor: not-allowed;
	}
	
	.btn-primary {
		background: #10b981;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.btn-secondary {
		background: #404040;
		color: #d4d4d4;
		border: none;
		padding: 12px 24px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.btn-secondary:hover {
		background: #525252;
	}
	
	.error-message {
		background: #451a1a;
		color: #ef4444;
		border: 1px solid #7f1d1d;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 16px;
		font-size: 14px;
	}
	
	.success-message {
		text-align: center;
		padding: 20px;
	}
	
	.success-icon {
		width: 60px;
		height: 60px;
		background: #48bb78;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 20px;
		font-size: 30px;
		font-weight: bold;
	}
	
	.success-message h3 {
		color: #ffffff;
		margin: 0 0 10px 0;
		font-size: 24px;
	}
	
	.success-message p {
		color: #d4d4d4;
		margin: 0 0 20px 0;
	}
</style>