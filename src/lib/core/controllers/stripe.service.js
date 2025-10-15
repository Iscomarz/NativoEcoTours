import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

// Inicializar Stripe con la clave secreta
const stripe = new Stripe(STRIPE_SECRET_KEY);

/**
 * Crear un Payment Intent para un pago libre
 * @param {number} amount - Cantidad en centavos para MXN (ej: 5000 = $50.00 MXN)
 * @param {string} currency - Moneda (ej: 'mxn', 'usd', 'eur')
 * @param {Object} metadata - Metadata adicional para el pago
 * @returns {Promise<Object>} Payment Intent creado
 */
export async function createPaymentIntent(amount, currency = 'mxn', metadata = {}) {
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(amount * 100), // Convertir a centavos
			currency,
			automatic_payment_methods: {
				enabled: true
			},
			metadata: {
				...metadata,
				created_at: new Date().toISOString()
			}
		});

		return {
			success: true,
			client_secret: paymentIntent.client_secret,
			payment_intent_id: paymentIntent.id
		};
	} catch (error) {
		console.error('Error creating payment intent:', error);
		return {
			success: false,
			error: error.message
		};
	}
}

/**
 * Confirmar un Payment Intent
 * @param {string} paymentIntentId - ID del Payment Intent
 * @returns {Promise<Object>} Resultado de la confirmación
 */
export async function confirmPaymentIntent(paymentIntentId) {
	try {
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
		
		return {
			success: true,
			status: paymentIntent.status,
			amount: paymentIntent.amount,
			currency: paymentIntent.currency,
			metadata: paymentIntent.metadata
		};
	} catch (error) {
		console.error('Error confirming payment intent:', error);
		return {
			success: false,
			error: error.message
		};
	}
}

/**
 * Obtener información de un pago
 * @param {string} paymentIntentId - ID del Payment Intent
 * @returns {Promise<Object>} Información del pago
 */
export async function getPaymentInfo(paymentIntentId) {
	try {
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
		
		return {
			success: true,
			payment: {
				id: paymentIntent.id,
				status: paymentIntent.status,
				amount: paymentIntent.amount / 100, // Convertir de centavos
				currency: paymentIntent.currency,
				created: paymentIntent.created,
				metadata: paymentIntent.metadata
			}
		};
	} catch (error) {
		console.error('Error getting payment info:', error);
		return {
			success: false,
			error: error.message
		};
	}
}

/**
 * Reembolsar un pago
 * @param {string} paymentIntentId - ID del Payment Intent
 * @param {number} amount - Cantidad a reembolsar (opcional, por defecto reembolsa todo)
 * @returns {Promise<Object>} Resultado del reembolso
 */
export async function createRefund(paymentIntentId, amount = null) {
	try {
		const refundData = {
			payment_intent: paymentIntentId
		};
		
		if (amount) {
			refundData.amount = Math.round(amount * 100); // Convertir a centavos
		}

		const refund = await stripe.refunds.create(refundData);
		
		return {
			success: true,
			refund: {
				id: refund.id,
				amount: refund.amount / 100, // Convertir de centavos
				status: refund.status,
				currency: refund.currency
			}
		};
	} catch (error) {
		console.error('Error creating refund:', error);
		return {
			success: false,
			error: error.message
		};
	}
}

/**
 * Validar webhook de Stripe
 * @param {string} payload - Payload del webhook
 * @param {string} signature - Signature del webhook
 * @returns {Object} Evento validado o error
 */
export function validateWebhook(payload, signature) {
	try {
		const event = stripe.webhooks.constructEvent(
			payload,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET
		);
		
		return {
			success: true,
			event
		};
	} catch (error) {
		console.error('Webhook signature verification failed:', error);
		return {
			success: false,
			error: error.message
		};
	}
}

export default stripe;