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

				// 1. Obtener la reserva actual con datos completos
				const { data: reserva, error: errFetch } = await supabaseAdmin
					.from('mreserva')
					.select('*, cexperiencia(*, dexperiencia(*)), dplazo(*)')
					.eq('id', Number(reservaId))
					.single();

				if (errFetch || !reserva) {
					console.error(`❌ Webhook: Reserva #${reservaId} no encontrada en Supabase:`, errFetch);
					break;
				}

				const dexper = Array.isArray(reserva.cexperiencia?.dexperiencia) 
					? reserva.cexperiencia.dexperiencia[0] 
					: reserva.cexperiencia?.dexperiencia;
				const whatsappLink = dexper?.grupo_whatsapp || reserva.cexperiencia?.whatsapp_link || '';

				const tipoPago = paymentIntent.metadata?.tipo_pago;
				const isSubsequentPlazo = tipoPago === 'plazo';
				const isPlazos = paymentIntent.metadata?.is_plazos === 'true' || Boolean(reserva.pago_a_plazos);

				// Caso A: Pago de un plazo posterior desde /perfil/pagar
				if (isSubsequentPlazo) {
					// 1. Registrar en mpago
					const { data: existingPago } = await supabaseAdmin
						.from('mpago')
						.select('id')
						.eq('payment_intent_id', paymentIntent.id)
						.maybeSingle();

					if (!existingPago) {
						await supabaseAdmin
							.from('mpago')
							.insert([{
								reserva_id: Number(reservaId),
								fecha_pago: new Date().toISOString(),
								monto_total: paymentIntent.amount / 100,
								completado: true,
								payment_intent_id: paymentIntent.id,
								payment_status: paymentIntent.status || 'succeeded'
							}]);
					}

					// 2. Registrar en dplazo si no existe
					const numPlazo = Number(paymentIntent.metadata?.numero_plazo) || ((reserva.dplazo?.length || 0) + 1);
					const { data: existingPlazo } = await supabaseAdmin
						.from('dplazo')
						.select('id')
						.eq('id_reserva', Number(reservaId))
						.eq('numero_plazo', numPlazo)
						.maybeSingle();

					if (!existingPlazo) {
						await supabaseAdmin
							.from('dplazo')
							.insert([{
								id_reserva: Number(reservaId),
								numero_plazo: numPlazo,
								monto: paymentIntent.amount / 100,
								fecha_vencimiento: new Date().toISOString().split('T')[0],
								pagado: true,
								fecha_pago: new Date().toISOString()
							}]);
					}

					// 3. Recalcular total pagado
					const { data: todosPlazos } = await supabaseAdmin
						.from('dplazo')
						.select('monto')
						.eq('id_reserva', Number(reservaId))
						.eq('pagado', true);

					const totalPagado = (todosPlazos || []).reduce((acc, p) => acc + Number(p.monto || 0), 0);
					const yaLiquidado = totalPagado >= (reserva.total || 0);

					if (yaLiquidado && reserva.estatus_id !== 1) {
						await supabaseAdmin
							.from('mreserva')
							.update({
								estatus_id: 1,
								fecha_liquidacion: new Date().toISOString()
							})
							.eq('id', Number(reservaId));

						// Enviar correo de liquidación 100% con botón de WhatsApp
						try {
							if (reserva.correo_cliente) {
								await sendConfirmationEmail({
									correo_cliente: reserva.correo_cliente,
									nombre_cliente: reserva.nombre_cliente,
									nombreExperiencia: reserva.cexperiencia?.titulo || 'Tu Experiencia',
									fecha_inicio: reserva.cexperiencia?.fecha_inicio,
									cantidad_grupo: reserva.cantidad_grupo,
									grupo: reserva.grupo,
									whatsappLink: whatsappLink,
									is_plazos: true,
									is_liquidacion: true,
									total: reserva.total,
									monto_pagado: totalPagado,
									monto_pendiente: 0
								});
								console.log(`✉️ Webhook: Correo de liquidación total enviado a ${reserva.correo_cliente}`);
							}
						} catch (errMail) {
							console.error('❌ Webhook: Error enviando correo de liquidación:', errMail);
						}
					}

					break;
				}

				// Caso B: Primer pago de la reserva (checkout inicial)
				const nuevoEstatus = isPlazos ? 6 : 1; // 6 = pago_parcial, 1 = completada

				if (reserva.estatus_id === 1 || (isPlazos && reserva.estatus_id === 6)) {
					console.log(`ℹ️ Webhook: La reserva #${reservaId} ya se encontraba procesada.`);
					break;
				}

				// Actualizar mreserva
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

				// Registrar en mpago evitando duplicados
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

				// Si es a plazos, registrar el primer plazo en dplazo
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

				// Limpiar bloqueos de habitación temporales
				const checkoutSessionId = paymentIntent.metadata?.checkout_session_id;
				if (checkoutSessionId) {
					await supabaseAdmin
						.from('bloqueos_habitacion')
						.delete()
						.eq('session_id', checkoutSessionId);
				}

				// Enviar correo de confirmación con Resend
				try {
					if (reserva.correo_cliente) {
						const montoCobrado = paymentIntent.amount / 100;
						const montoPendiente = isPlazos ? Math.max(0, (reserva.total || 0) - montoCobrado) : 0;

						await sendConfirmationEmail({
							correo_cliente: reserva.correo_cliente,
							nombre_cliente: reserva.nombre_cliente,
							nombreExperiencia: reserva.cexperiencia?.titulo || 'Tu Experiencia',
							fecha_inicio: reserva.cexperiencia?.fecha_inicio,
							cantidad_grupo: reserva.cantidad_grupo,
							grupo: reserva.grupo,
							whatsappLink: whatsappLink,
							is_plazos: isPlazos,
							is_liquidacion: false,
							total: reserva.total,
							monto_pagado: montoCobrado,
							monto_pendiente: montoPendiente,
							fecha_limite: reserva.cexperiencia?.fecha_inicio
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
