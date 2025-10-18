import { json } from '@sveltejs/kit';
import { validateWebhook } from '$lib/core/controllers/stripe.service.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const signature = request.headers.get('stripe-signature');
		const payload = await request.text();
		
		if (!signature) {
			return json(
				{ error: 'Missing Stripe signature' }, 
				{ status: 400 }
			);
		}

		const validation = validateWebhook(payload, signature);
		
		if (!validation.success) {
			return json(
				{ error: validation.error }, 
				{ status: 400 }
			);
		}

		const event = validation.event;
		
		// Manejar diferentes tipos de eventos
		switch (event.type) {
			case 'payment_intent.succeeded':
				console.log('✅ Payment succeeded:', event.data.object.id);
				// Aquí puedes actualizar tu base de datos, enviar confirmación, etc.
				break;
				
			case 'payment_intent.payment_failed':
				console.log('❌ Payment failed:', event.data.object.id);
				// Manejar pagos fallidos
				break;
				
			case 'payment_intent.canceled':
				console.log('🚫 Payment canceled:', event.data.object.id);
				// Manejar pagos cancelados
				break;
				
			default:
				console.log(`Unhandled event type: ${event.type}`);
		}
		
		return json({ received: true });
		
	} catch (error) {
		console.error('Webhook error:', error);
		return json(
			{ error: 'Webhook handler failed' }, 
			{ status: 400 }
		);
	}
}