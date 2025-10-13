class MReserva {
    constructor({
        // Datos de usuario (autenticado o no)
        usuario_id = null,            // UUID si está logueado
        nombre_cliente = null,        // Nombre si no está logueado
        correo_cliente = null,        // Email si no está logueado
        numero_cliente = null,        // Teléfono si no está logueado
        
        // Datos de la experiencia
        experiencia_id = null,        // ID de la experiencia
        estatus_id = 1,
        fecha_reserva = new Date(),   // Fecha de la reserva (default: ahora)
        fecha_liquidacion = null,     // Fecha de liquidación (null si no pagado)
        
        // Datos financieros
        total = 0,                    // Monto total
        metodo_pago_id = null,        // ID del método de pago
        pago_a_plazos = false,        // Si es pago en cuotas
        
        // Datos de grupo
        grupo = false,                // Si es reserva grupal
        cantidad_grupo = 1,           // Cantidad de personas
        precio_unitario = 0,          // Precio por persona
    } = {}) {
        // Asignar propiedades
        this.usuario_id = usuario_id;
        this.nombre_cliente = nombre_cliente;
        this.correo_cliente = correo_cliente;
        this.numero_cliente = numero_cliente;
        this.experiencia_id = experiencia_id;
        this.estatus_id = estatus_id;
        this.fecha_reserva = fecha_reserva;
        this.fecha_liquidacion = fecha_liquidacion;
        this.total = total;
        this.metodo_pago_id = metodo_pago_id;
        this.pago_a_plazos = pago_a_plazos;
        this.grupo = grupo;
        this.cantidad_grupo = cantidad_grupo;
        this.precio_unitario = precio_unitario;
        
        // Propiedades derivadas
        this.habitaciones = []; // Array para almacenar IDs de habitaciones y cantidades
    }

    // Método para agregar habitaciones
    agregarHabitacion(habitacion_id, cantidad = 1) {
        this.habitaciones.push({
            habitacion_id,
            cantidad
        });
        return this;
    }

    // Método para calcular total basado en precio unitario y cantidad
    calcularTotal() {
        this.total = this.precio_unitario * this.cantidad_grupo;
        return this.total;
    }
    
    // Método para establecer liquidación completa
    completarPago() {
        this.fecha_liquidacion = new Date();
        return this;
    }

    // Verificar si la reserva tiene la información básica completa
    esValida() {
        // Si hay usuario_id, no necesitamos los datos de cliente
        if (this.usuario_id) {
            return Boolean(
                this.usuario_id && 
                this.experiencia_id && 
                this.cantidad_grupo > 0
            );
        }
        
        // Si no hay usuario_id, necesitamos los datos de cliente
        return Boolean(
            this.nombre_cliente && 
            this.correo_cliente && 
            this.numero_cliente && 
            this.experiencia_id && 
            this.cantidad_grupo > 0
        );
    }

    // Convertir a objeto simple para almacenar en DB
    toJSON() {
        return {
            usuario_id: this.usuario_id,
            nombre_cliente: this.nombre_cliente,
            correo_cliente: this.correo_cliente,
            numero_cliente: this.numero_cliente,
            experiencia_id: this.experiencia_id,
            fecha_reserva: this.fecha_reserva,
            fecha_liquidacion: this.fecha_liquidacion,
            total: this.total,
            metodo_pago_id: this.metodo_pago_id,
            pago_a_plazos: this.pago_a_plazos,
            grupo: this.grupo,
            cantidad_grupo: this.cantidad_grupo,
            precio_unitario: this.precio_unitario,
            habitaciones: [...this.habitaciones]
        };
    }
}

export default MReserva;