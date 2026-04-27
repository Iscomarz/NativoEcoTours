import { supabase } from "../supabase/client";

/**
 * Obtiene la cantidad de espacios ocupados para una habitación específica
 * @param {number} idhabitacion - ID de la habitación 
 * @returns {Promise<number>} - Cantidad total de espacios ocupados
 */
export const getEspaciosOcupados = async (idhabitacion) => {
  try {
    const { data, error } = await supabase.rpc('obtener_ocupacion_habitaciones', {
      p_ids: [parseInt(idhabitacion)]
    });

    if (error) throw error;
    return data?.[0]?.total_ocupado || 0;
    
  } catch (error) {
    console.error('Error en getEspaciosOcupados:', error);
    return 0;
  }
};

/**
 * Obtiene las ocupaciones de todas las habitaciones de una vez, incluyendo bloqueos
 * @param {Array} habitacionIds - Array de IDs de habitaciones 
 * @returns {Promise<Object>} - Objeto con ocupaciones por habitación { habitacionId: numeroClientes }
 */
export const getOcupacionesMultiplesHabitaciones = async (habitacionIds) => {
  try {
    if (!habitacionIds || habitacionIds.length === 0) return {};

    const { data, error } = await supabase.rpc('obtener_ocupacion_habitaciones', {
      p_ids: habitacionIds.map(id => parseInt(id))
    });

    if (error) throw error;

    const ocupacionesPorHabitacion = {};
    if (data) {
      data.forEach(item => {
        ocupacionesPorHabitacion[item.habitacion_id] = item.total_ocupado;
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
 * Crea bloqueos temporales para una lista de habitaciones seleccionadas
 * @param {Array} bloqueos - Lista de objetos { id_habitacion, cantidad, session_id }
 * @returns {Promise<boolean>} - True si todos los bloqueos fueron exitosos
 */
export const crearBloqueosTemporales = async (bloqueos) => {
  try {
    // Usamos el RPC para asegurar atomicidad y evitar race conditions
    for (const b of bloqueos) {
      const { data, error } = await supabase.rpc('intentar_bloqueo_habitacion', {
        p_id_habitacion: b.id_habitacion,
        p_cantidad: b.cantidad,
        p_session_id: b.session_id
      });

      if (error) throw error;
      if (!data) {
        throw new Error('Lo sentimos, uno de los espacios seleccionados ya no está disponible.');
      }
    }
    return true;
  } catch (error) {
    console.error('Error al crear bloqueos:', error);
    throw error;
  }
};

/**
 * Elimina los bloqueos asociados a una sesión específica
 * @param {string} sessionId - ID de la sesión/checkout
 */
export const eliminarBloqueosActivos = async (sessionId) => {
  try {
    const { error } = await supabase
      .from('bloqueos_habitacion')
      .delete()
      .eq('session_id', sessionId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error al eliminar bloqueos:', error);
    return false;
  }
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