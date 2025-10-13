import { id } from "prelude-ls";
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