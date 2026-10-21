import { json } from '@sveltejs/kit';
import { validateWebhook } from '$lib/core/controllers/stripe.service.js';
import { getSupabaseAdmin } from '$lib/server/supabaseAdmin.js';
import { sendConfirmationEmail } from '$lib/server/email.js';

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
			console.error('❌ Error de validación de firma en webhook:', validation.error);
			return json(
				{ error: validation.error }, 
				{ status: 400 }
			);
		}

		const event = validation.event;
		const supabaseAdmin = getSupabaseAdmin();
		
		// Manejar diferentes tipos de eventos
		switch (event.type) {
			case 'payment_intent.succeeded': {
				const paymentIntent = event.data.object;
				console.log('✅ Webhook: Payment succeeded:', paymentIntent.id);

				const reservaId = paymentIntent.metadata?.reserva_id;
				if (!reservaId || reservaId === 'temp') {
					console.warn('⚠️ Webhook: PaymentIntent sin reserva_id válida en metadata:', paymentIntent.id);
					break;
				}

				// 1. Obtener la reserva actual
				const { data: reserva, error: errFetch } = await supabaseAdmin
					.from('mreserva')
					.select('*, cexperiencia(*)')
					.eq('id', Number(reservaId))
					.single();

				if (errFetch || !reserva) {
					console.error(`❌ Webhook: Reserva #${reservaId} no encontrada en Supabase:`, errFetch);
					break;
				}

				// 2. Idempotencia: Si ya está completada (1) o con enganche pagado (6), omitir
				const isPlazos = paymentIntent.metadata?.is_plazos === 'true' || Boolean(reserva.pago_a_plazos);
				const nuevoEstatus = isPlazos ? 6 : 1; // 6 = pago_parcial, 1 = completada

				if (reserva.estatus_id === 1 || (isPlazos && reserva.estatus_id === 6)) {
					console.log(`ℹ️ Webhook: La reserva #${reservaId} ya se encontraba procesada.`);
					break;
				}

				// 3. Actualizar mreserva
				const { error: errUpdate } = await supabaseAdmin
					.from('mreserva')
					.update({
						estatus_id: nuevoEstatus,
						fecha_liquidacion: isPlazos ? null : new Date().toISOString()
					})
					.eq('id', Number(reservaId));

				if (errUpdate) {
					console.error(`❌ Webhook: Error actualizando estatus de reserva #${reservaId}:`, errUpdate);
				}

				// 4. Registrar en mpago evitando duplicados
				const { data: existingPago } = await supabaseAdmin
					.from('mpago')
					.select('id')
					.eq('payment_intent_id', paymentIntent.id)
					.maybeSingle();

				if (!existingPago) {
					const { error: errPago } = await supabaseAdmin
						.from('mpago')
						.insert([{
							reserva_id: Number(reservaId),
							fecha_pago: new Date().toISOString(),
							monto_total: paymentIntent.amount / 100,
							completado: true,
							payment_intent_id: paymentIntent.id,
							payment_status: paymentIntent.status || 'succeeded'
						}]);

					if (errPago) {
						console.error(`❌ Webhook: Error insertando mpago para reserva #${reservaId}:`, errPago);
					}
				}

				// 5. Si es a plazos, registrar el primer plazo pagado en dplazo
				if (isPlazos) {
					const { data: existingPlazo } = await supabaseAdmin
						.from('dplazo')
						.select('id')
						.eq('id_reserva', Number(reservaId))
						.eq('numero_plazo', 1)
						.maybeSingle();

					if (!existingPlazo) {
						const { error: errPlazo } = await supabaseAdmin
							.from('dplazo')
							.insert([{
								id_reserva: Number(reservaId),
								numero_plazo: 1,
								monto: paymentIntent.amount / 100,
								fecha_vencimiento: new Date().toISOString().split('T')[0],
								pagado: true,
								fecha_pago: new Date().toISOString()
							}]);

						if (errPlazo) {
							console.error(`❌ Webhook: Error insertando dplazo para reserva #${reservaId}:`, errPlazo);
						}
					}
				}

				// 6. Limpiar bloqueos de habitación temporales
				const checkoutSessionId = paymentIntent.metadata?.checkout_session_id;
				if (checkoutSessionId) {
					await supabaseAdmin
						.from('bloqueos_habitacion')
						.delete()
						.eq('session_id', checkoutSessionId);
				}

				// 7. Enviar correo de confirmación con Resend
				try {
					if (reserva.correo_cliente) {
						await sendConfirmationEmail({
							correo_cliente: reserva.correo_cliente,
							nombre_cliente: reserva.nombre_cliente,
							nombreExperiencia: reserva.cexperiencia?.titulo || 'Tu Experiencia',
							fecha_inicio: reserva.cexperiencia?.fecha_inicio,
							cantidad_grupo: reserva.cantidad_grupo,
							grupo: reserva.grupo,
							whatsappLink: reserva.cexperiencia?.whatsapp_link || ''
						});
						console.log(`✉️ Webhook: Correo de confirmación enviado exitosamente a ${reserva.correo_cliente}`);
					}
				} catch (errMail) {
					console.error(`❌ Webhook: Error al enviar correo de confirmación:`, errMail);
				}

				break;
			}
				
			case 'payment_intent.payment_failed': {
				const paymentIntent = event.data.object;
				console.log('❌ Webhook: Payment failed:', paymentIntent.id);
				const reservaId = paymentIntent.metadata?.reserva_id;
				if (reservaId && reservaId !== 'temp') {
					await supabaseAdmin
						.from('mreserva')
						.update({ estatus_id: 7 }) // 7 = cancelada
						.eq('id', Number(reservaId))
						.eq('estatus_id', 5); // Solo si aún estaba pendiente
				}
				break;
			}
				
			case 'payment_intent.canceled': {
				const paymentIntent = event.data.object;
				console.log('🚫 Webhook: Payment canceled:', paymentIntent.id);
				const reservaId = paymentIntent.metadata?.reserva_id;
				if (reservaId && reservaId !== 'temp') {
					await supabaseAdmin
						.from('mreserva')
						.update({ estatus_id: 7 }) // 7 = cancelada
						.eq('id', Number(reservaId))
						.eq('estatus_id', 5);
				}
				break;
			}
				
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
