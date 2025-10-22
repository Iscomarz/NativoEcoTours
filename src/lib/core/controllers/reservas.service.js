import { supabase } from "../supabase/client";

export const getReservas = async () => {
  const { data, error } = await supabase.from("reservas").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getReservaById = async (id) => {
  const { data, error } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const createReserva = async (reserva) => {
  // Si la reserva es una instancia de MReserva, usar toDatabase()
  const reservaData = reserva && typeof reserva.toDatabase === 'function' 
    ? reserva.toDatabase() 
    : reserva;
    
  const { data, error } = await supabase
    .from("mreserva")
    .insert([reservaData])
    .select(); // Esto hace que retorne los datos insertados
    
  if (error) {
    throw new Error(error.message);
  }

  console.log('Reserva guardada con éxito:', data);
  return data;
};

export const createPago = async (pago) => {
  const { data, error } = await supabase
    .from("mpago")
    .insert([pago])
    .select(); // Retorna los datos insertados
    
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const createHabitacionReserva = async (habitacionReserva) => {
  const { data, error } = await supabase
    .from("rhabitacionreserva")
    .insert([habitacionReserva])
    .select(); // Retorna los datos insertados
    
  if (error) {
    throw new Error(error.message);
  }

  await actualizarConteoCapacidad(habitacionReserva);
  return data;
};

async function actualizarConteoCapacidad(habitacionReserva) {
  try {
    // 1. Obtener el valor actual de conteo_capacidad
    const { data: habitacion, error: selectError } = await supabase
      .from("dhabitacion")
      .select("conteo_capacidad")
      .eq('id', habitacionReserva.idhabitacion)
      .single();
      
    if (selectError) {
      throw new Error(`Error al obtener habitación: ${selectError.message}`);
    }
    
    // 2. Calcular el nuevo conteo
    const conteoActual = habitacion?.conteo_capacidad || 0;
    const nuevoConteo = conteoActual + habitacionReserva.totalclientes;
    
    console.log(`Actualizando conteo habitación ${habitacionReserva.idhabitacion}: ${conteoActual} + ${habitacionReserva.totalclientes} = ${nuevoConteo}`);
    
    // 3. Actualizar el conteo
    const { data, error } = await supabase
      .from("dhabitacion")
      .update({ conteo_capacidad: nuevoConteo })
      .eq('id', habitacionReserva.idhabitacion);
      
    if (error) {
      throw new Error(`Error al actualizar conteo: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error en actualizarConteoCapacidad:', error);
    throw error;
  }
}
