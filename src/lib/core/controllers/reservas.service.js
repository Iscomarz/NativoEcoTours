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
    .from("rHabitacionReserva")
    .insert([habitacionReserva])
    .select(); // Retorna los datos insertados
    
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
