import { writable } from "svelte/store";

export const reservaStore = writable({
  idusuario: null,  
  nombre: null,
  email: null,
  telefono: null,
  idexperiencia: null,
  fechaReserva: null,
  fechaLiquidacion: null,
  totalImporte: null,
  metodoPago: null,
  pagoPlazos: null,
  grupo: null,
  totalPersonas: null,
  precioUnitario: null,
  habitaciones: [{ idhabitacion: null, cantidad: null }],
  // Campos para Stripe
  payment_intent_id: null,
  client_secret: null,
  payment_status: 'pending', // 'pending', 'processing', 'succeeded', 'failed', 'canceled'
  stripe_payment_method: null,
  fecha_pago: null,
  amount_mxn: null,
  currency: 'mxn'
});

//Funciones para manipular el store
export function agregarExperiencia(reserva) {
    reservaStore.update(datos => ({
        ...datos,
        idexperiencia: reserva.idexperiencia,
        fechaReserva: reserva.fechaReserva,
        fechaLiquidacion: reserva.fechaLiquidacion,
        nombre: reserva.nombre,
        email: reserva.email,
        telefono: reserva.telefono,
        totalImporte: reserva.totalImporte,
        metodoPago: reserva.metodoPago,
        pagoPlazos: reserva.pagoPlazos,
        grupo: reserva.grupo,
        totalPersonas: reserva.totalPersonas,
        precioUnitario: reserva.precioUnitario
    }));
}

export function agregarHabitacion(id, cantidad) {
    reservaStore.update(datos => ({
        ...datos,
        habitaciones: [...datos.habitaciones, { idhabitacion: id, cantidad }]
    }));
}

// Funciones específicas para manejo de pagos con Stripe
export function iniciarPago(clientSecret, amountMXN) {
    reservaStore.update(datos => ({
        ...datos,
        client_secret: clientSecret,
        payment_status: 'processing',
        amount_mxn: amountMXN
    }));
}

export function confirmarPago(paymentIntent) {
    reservaStore.update(datos => ({
        ...datos,
        payment_intent_id: paymentIntent.id,
        payment_status: paymentIntent.status,
        stripe_payment_method: paymentIntent.payment_method,
        fecha_pago: new Date().toISOString(),
        metodoPago: 'stripe_card'
    }));
}

export function fallarPago(error) {
    reservaStore.update(datos => ({
        ...datos,
        payment_status: 'failed',
        payment_error: error
    }));
}

export function cancelarPago() {
    reservaStore.update(datos => ({
        ...datos,
        payment_status: 'canceled',
        client_secret: null,
        payment_intent_id: null
    }));
}

export function resetearPago() {
    reservaStore.update(datos => ({
        ...datos,
        payment_intent_id: null,
        client_secret: null,
        payment_status: 'pending',
        stripe_payment_method: null,
        fecha_pago: null,
        amount_mxn: null,
        payment_error: null
    }));
}