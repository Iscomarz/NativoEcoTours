import { json } from '@sveltejs/kit';
import { createPaymentIntent } from '$lib/core/controllers/stripe.service.js';
import { getSupabaseAdmin } from '$lib/server/supabaseAdmin.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { amount, currency = 'mxn', metadata = {}, reservaData } = await request.json();
		
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

		let reservaId = reservaData?.id;
		const supabaseAdmin = getSupabaseAdmin();

		// Si vienen datos de reserva y aún no tiene ID en base de datos, crearla en estado 'pendiente' (estatus_id = 5)
		if (reservaData && (!reservaId || reservaId === 'temp')) {
			try {
				const { data: newReserva, error: errReserva } = await supabaseAdmin
					.from('mreserva')
					.insert([{
						usuario_id: reservaData.usuario_id || null,
						nombre_cliente: reservaData.nombre_cliente || null,
						correo_cliente: reservaData.correo_cliente || null,
						numero_cliente: reservaData.numero_cliente ? Number(reservaData.numero_cliente) : null,
						experiencia_id: reservaData.experiencia_id,
						estatus_id: 5, // 5 = pendiente de pago
						fecha_reserva: reservaData.fecha_reserva || new Date().toISOString(),
						fecha_liquidacion: null,
						total: reservaData.total,
						metodo_pago_id: 1, // 1 = Tarjeta/Stripe
						pago_a_plazos: Boolean(reservaData.pago_a_plazos),
						grupo: Boolean(reservaData.grupo),
						cantidad_grupo: reservaData.cantidad_grupo || 1,
						precio_unitario: reservaData.precio_unitario || 0
					}])
					.select()
					.single();

				if (errReserva) {
					console.error('❌ Error al crear mreserva preliminar:', errReserva);
					return json({ 
						success: false, 
						error: 'No se pudo registrar la reserva preliminar en base de datos' 
					}, { status: 500 });
				}

				reservaId = newReserva.id;

				// Asociar habitaciones y actualizar capacidad si aplican
				if (Array.isArray(reservaData.habitaciones) && reservaData.habitaciones.length > 0) {
					for (const hab of reservaData.habitaciones) {
						if (hab.habitacion_id) {
							await supabaseAdmin.from('rhabitacionreserva').insert([{
								idhabitacion: hab.habitacion_id,
								idmreserva: reservaId,
								totalclientes: hab.cantidad || 1
							}]);

							// Conteo de capacidad en dhabitacion
							const { data: habActual } = await supabaseAdmin
								.from('dhabitacion')
								.select('conteo_capacidad')
								.eq('id', hab.habitacion_id)
								.single();

							const nuevoConteo = (habActual?.conteo_capacidad || 0) + (hab.cantidad || 1);
							await supabaseAdmin
								.from('dhabitacion')
								.update({ conteo_capacidad: nuevoConteo })
								.eq('id', hab.habitacion_id);
						}
					}
				}
			} catch (errDb) {
				console.error('❌ Excepción al registrar reserva preliminar:', errDb);
				return json({ 
					success: false, 
					error: 'Error al procesar reserva en base de datos' 
				}, { status: 500 });
			}
		}

		// Enriquecer los metadatos de Stripe para que el webhook reconozca el evento
		const finalMetadata = {
			...metadata,
			reserva_id: reservaId ? String(reservaId) : (metadata.reserva_id || 'temp'),
			checkout_session_id: reservaData?.checkout_session_id || metadata?.checkout_session_id || '',
			is_plazos: (reservaData?.pago_a_plazos || metadata?.pago_a_plazos) ? 'true' : 'false'
		};

		// Crear el Payment Intent en Stripe
		const result = await createPaymentIntent(amount, currency, finalMetadata);
		
		if (result.success) {
			return json({
				success: true,
				client_secret: result.client_secret,
				payment_intent_id: result.payment_intent_id,
				reserva_id: reservaId || null
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
