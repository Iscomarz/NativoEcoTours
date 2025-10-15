import { json } from '@sveltejs/kit';
import { confirmPaymentIntent } from '$lib/core/controllers/stripe.service.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { payment_intent_id } = await request.json();
		
		if (!payment_intent_id) {
			return json(
				{ 
					success: false, 
					error: 'Payment Intent ID is required' 
				}, 
				{ status: 400 }
			);
		}

		const result = await confirmPaymentIntent(payment_intent_id);
		
		if (result.success) {
			return json({
				success: true,
				status: result.status,
				amount: result.amount,
				currency: result.currency,
				metadata: result.metadata
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
		console.error('Error confirming payment:', error);
		return json(
			{ 
				success: false, 
				error: 'Internal server error' 
			}, 
			{ status: 500 }
		);
	}
}