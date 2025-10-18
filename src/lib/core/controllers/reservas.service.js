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
  const { data, error } = await supabase.from("reservas").insert([reserva]);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

