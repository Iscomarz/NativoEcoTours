import { supabase } from "../supabase/client";

/**
 * Obtiene la cantidad de espacios ocupados para una habitación específica
 * @param {number} idhabitacion - ID de la habitación 
 * @returns {Promise<number>} - Cantidad total de espacios ocupados
 */
export const getEspaciosOcupados = async (idhabitacion) => {
  try {
    const { data, error } = await supabase
      .from("rhabitacionreserva")
      .select('*')
      .eq('idhabitacion', idhabitacion);

    if (error) {
      console.error('Error al obtener ocupaciones:', error);
      throw new Error(error.message);
    }

    // Sumar todos los totalclientes para esta habitación
    const totalOcupados = data?.reduce((total, reserva) => {
      return total + (reserva.totalclientes || 0);
    }, 0) || 0;

    return totalOcupados;
    
  } catch (error) {
    console.error('Error en getEspaciosOcupados:', error);
    return 0;
  }
};

/**
 * Obtiene las ocupaciones de todas las habitaciones de una vez
 * @param {Array} habitacionIds - Array de IDs de habitaciones 
 * @returns {Promise<Object>} - Objeto con ocupaciones por habitación { habitacionId: numeroClientes }
 */
export const getOcupacionesMultiplesHabitaciones = async (habitacionIds) => {
  try {
    if (!habitacionIds || habitacionIds.length === 0) return {};

    const { data, error } = await supabase
      .from("rhabitacionreserva")
      .select('*')
      .in('idhabitacion', habitacionIds);

    if (error) {
      console.error('Error al obtener ocupaciones:', error);
      throw new Error(error.message);
    }

    // Agrupar por habitación y sumar los clientes
    const ocupacionesPorHabitacion = {};
    
    // Inicializar todas las habitaciones con 0
    habitacionIds.forEach(id => {
      ocupacionesPorHabitacion[id] = 0;
    });

    // Sumar ocupaciones
    if (data) {
      data.forEach(reserva => {
        const habitacionId = reserva.idhabitacion;
        const clientes = reserva.totalclientes || 0;
        ocupacionesPorHabitacion[habitacionId] += clientes;
      });
    }

    return ocupacionesPorHabitacion;
    
  } catch (error) {
    console.error('Error en getOcupacionesMultiplesHabitaciones:', error);
    return {};
  }
};

/**
 * Calcula los espacios ocupados para cada habitación basándose en el conteo total
 * @param {Array} habitaciones - Array de habitaciones con estructura [{ id, id_chabitacion, capacidad, ... }]
 * @param {Object} ocupaciones - Objeto con ocupaciones por habitación { habitacionId: numeroClientes }
 * @returns {Object} - Objeto con espacios ocupados por índice de habitación
 */
export const calcularEspaciosOcupados = (habitaciones, ocupaciones) => {
  const espaciosOcupados = {};
  
  habitaciones.forEach((habitacion, index) => {
    // Obtener el ID de la habitación (puede estar en diferentes propiedades)
    const habitacionId = habitacion.id || habitacion.id || habitacion.id;
    const clientesOcupados = ocupaciones[habitacionId] || 0;
    
    // Crear array de índices ocupados (0, 1, 2, ... hasta clientesOcupados-1)
    espaciosOcupados[index] = [];
    for (let i = 0; i < clientesOcupados; i++) {
      espaciosOcupados[index].push(i);
    }
  });
  
  return espaciosOcupados;
};

/**
 * Función de utilidad para verificar si un espacio específico está ocupado
 * @param {Object} espaciosOcupados - Resultado de calcularEspaciosOcupados
 * @param {number} habitacionIndex - Índice de la habitación
 * @param {number} espacioIndex - Índice del espacio dentro de la habitación
 * @returns {boolean} - true si el espacio está ocupado
 */
export const isEspacioOcupado = (espaciosOcupados, habitacionIndex, espacioIndex) => {
  return espaciosOcupados[habitacionIndex]?.includes(espacioIndex) || false;
};