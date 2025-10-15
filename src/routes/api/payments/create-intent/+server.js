import { json } from '@sveltejs/kit';
import { createPaymentIntent } from '$lib/core/controllers/stripe.service.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { amount, currency, metadata } = await request.json();
		
		// Validar que se proporcione una cantidad
		if (!amount || amount <= 0) {
			return json(
				{ 
					success: false, 
					error: 'Amount is required and must be greater than 0' 
				}, 
				{ status: 400 }
			);
		}

		// Crear el Payment Intent
		const result = await createPaymentIntent(amount, currency, metadata);
		
		if (result.success) {
			return json({
				success: true,
				client_secret: result.client_secret,
				payment_intent_id: result.payment_intent_id
			});
		} else {
			return json(
				{ 
					success: false, 
					error: result.error 
				}, 
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('Error in payment intent creation:', error);
		return json(
			{ 
				success: false, 
				error: 'Internal server error' 
			}, 
			{ status: 500 }
		);
	}
}