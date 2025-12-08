<script>
    import { reservaStore } from '$lib/stores/reservaStore';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { toast, Toaster } from 'svelte-sonner';
    import StripePayment from '$lib/components/pagos/StripePayment.svelte';
	import { createReserva, createPago, createHabitacionReserva } from '$lib/core/controllers/reservas.service.js';
	import MReserva from '$lib/objects/MReserva';
    
    export let data;
    
    // Datos del servidor
    let sesionActiva = data?.sesionActiva || false;
    let session = data?.session || null;
    let currentReserva = {};
    let formaPago = 'tarjeta'; // tarjeta, transferencia
    let tarjeta = {
        numero: '',
        nombre: '',
        expiracion: '',
        cvv: ''
    };
    let guardadoPago = false;
    let loadingPago = false;
    
    // Variables para el cronómetro
    let tiempoRestante = 8 * 60; // 8 minutos en segundos
    let intervalId;
    let tiempoFormateado = '';
    
    // Formatear tiempo en MM:SS
    function formatearTiempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segs = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }
    
    // Variables para datos personales
    let datosPersonales = {
        nombre: '',
        correo: '',
        telefono: ''
    };

    // Inicializar cronómetro y validaciones
    onMount(() => {
        currentReserva = $reservaStore;
        
        // 1. Validar que existan datos de reserva
        if (!currentReserva || !currentReserva.experiencia_id || !currentReserva.habitaciones || currentReserva.habitaciones.length === 0) {
            goto('/');
            return;
        }
        
        // 2. Configurar datos personales según sesión
        if (sesionActiva && session) {
            // Si hay sesión activa, usar datos de la sesión
            datosPersonales = {
                nombre: session.user?.user_metadata?.full_name || session.user?.email?.split('@')[0] || '',
                correo: session.user?.email || '',
                telefono: session.user?.user_metadata?.phone || ''
            };
        } else {
            // Si no hay sesión, usar datos del store
            datosPersonales = {
                nombre: currentReserva.nombre_cliente || '',
                correo: currentReserva.correo_cliente || '',
                telefono: currentReserva.numero_cliente || ''
            };
        }
        
        // Iniciar el cronómetro
        tiempoFormateado = formatearTiempo(tiempoRestante);
        intervalId = setInterval(() => {
            tiempoRestante -= 1;
            tiempoFormateado = formatearTiempo(tiempoRestante);
            
            // Si se acabó el tiempo
            if (tiempoRestante <= 0) {
                // Limpiar el intervalo
                clearInterval(intervalId);
                
                // Resetear el store
                reservaStore.set({});
                
                // Redirigir a la página de inicio
                goto('/');
                
                // También podrías mostrar un mensaje antes de redirigir
                toast.error('¡Tiempo agotado! Tu reserva ha sido cancelada.');
            }
        }, 1000);
    });
    
    // Limpiar el intervalo al destruir el componente
    onDestroy(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    });
    
    function formatoMoneda(valor) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(valor || 0);
    }
    
    function procesarPago() {
        loadingPago = true;
        
        // Simulamos procesamiento para transferencia
        setTimeout(() => {
            loadingPago = false;
            guardadoPago = true;
            // Aquí conectarías con tu procesador de pagos real
            // y manejarías la respuesta
        }, 1500);
    }

    async function handlePaymentSuccess(paymentIntent) {
        // Limpiar el cronómetro
        if (intervalId) {
            clearInterval(intervalId);
        }
        
        try {
            
            // 1. Crear un objeto MReserva con los datos necesarios
            const nuevaReserva = new MReserva({
                // Datos del usuario o cliente
                usuario_id: sesionActiva ? session?.user?.id : null,
                nombre_cliente: !sesionActiva ? datosPersonales.nombre : null,
                correo_cliente: !sesionActiva ? datosPersonales.correo : null,
                numero_cliente: !sesionActiva ? datosPersonales.telefono : null,
                
                // Datos de la experiencia
                experiencia_id: $reservaStore.experiencia_id,
                fecha_reserva: new Date($reservaStore.fecha_reserva || new Date()),
                fecha_liquidacion: new Date(), // Pagado ahora
                
                // Datos financieros
                total: $reservaStore.total,
                metodo_pago_id: formaPago === 'tarjeta' ? 1 : 2, // Asumiendo IDs: 1=tarjeta, 2=transferencia
                pago_a_plazos: false, // O según corresponda
                
                // Datos de grupo
                grupo: $reservaStore.grupo,
                cantidad_grupo: $reservaStore.cantidad_grupo || 1,
                precio_unitario: $reservaStore.precio_unitario
            });
            
            // 2. Agregar las habitaciones al objeto MReserva (para lógica local)
            if ($reservaStore.habitaciones && Array.isArray($reservaStore.habitaciones)) {
                $reservaStore.habitaciones.forEach(hab => {
                    nuevaReserva.agregarHabitacion(hab.habitacion_id, hab.cantidad);
                });
            }
            
            // 3. Guardar la reserva en Supabase
            const resultado = await createReserva(nuevaReserva);
            
            // Obtener el ID de la reserva creada
            const reservaId = resultado?.[0]?.id;
            if (!reservaId) {
                throw new Error('No se pudo obtener el ID de la reserva creada');
            }
            
            // 4. Crear el registro de pago
            const pagoData = {
                reserva_id: reservaId,
                fecha_pago: new Date().toISOString(),
                monto_total: $reservaStore.total,
                completado: true,
                payment_intent_id: paymentIntent.id,
                payment_status: paymentIntent.status || 'succeeded'
            };
            
            const resultadoPago = await createPago(pagoData);
            
            // 5. Crear los registros de habitaciones reservadas
            if ($reservaStore.habitaciones && Array.isArray($reservaStore.habitaciones)) {
                for (const habitacion of $reservaStore.habitaciones) {
                    try {
                        const habitacionReservaData = {
                            idhabitacion: habitacion.habitacion_id,
                            idmreserva: reservaId,
                            totalclientes: habitacion.cantidad
                        };
                        
                        const resultadoHabitacion = await createHabitacionReserva(habitacionReservaData);
                    } catch (errorHabitacion) {
                        console.error(`Error al guardar habitación ${habitacion.habitacion_id}:`, errorHabitacion);
                        // Continúa con las demás habitaciones aunque una falle
                    }
                }
            }
            
            // 6. Actualizar UI
            guardadoPago = true;
            
            // 7. Actualizar store con datos finales (incluyendo ID de la DB)
            reservaStore.update(reserva => ({
                ...reserva,
                id: reservaId,
                payment_intent_id: paymentIntent.id,
                payment_status: paymentIntent.status || 'succeeded',
                status: 'pagado',
                fecha_pago: new Date().toISOString(),
                completado: true
            }));
            
        } catch (error) {
            console.error('Error en el proceso de guardado:', error);
            
            // Mostrar error específico según el tipo
            let errorMessage = 'Error desconocido';
            if (error.message.includes('reserva')) {
                errorMessage = 'Error al guardar la reserva principal';
            } else if (error.message.includes('pago')) {
                errorMessage = 'Error al registrar el pago';
            } else if (error.message.includes('habitacion')) {
                errorMessage = 'Error al reservar las habitaciones';
            } else {
                errorMessage = error.message;
            }
            
            toast.error(`${errorMessage}. El pago fue exitoso, pero contacta al soporte para verificar tu reserva.`);
            // Mantener visible que el pago fue exitoso aunque haya errores en el guardado
            guardadoPago = true;
        }
    }

    function handlePaymentError(error) {
        console.error('Error en el pago:', error);
        // Aquí puedes mostrar el error al usuario
        // Por ejemplo, con una notificación toast
        toast.error(`Error en el pago: ${error.message}`);
    }

    // Función para obtener el monto total en MXN (ya viene en pesos mexicanos)
    $: totalMXN = $reservaStore?.total || 0;
</script>

<Toaster />

<div class="min-h-screen bg-[#181818] py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
        <!-- Encabezado -->
        <div class="text-center mb-10">
            <h1 class="text-3xl font-extrabold text-white">Finalizar Reserva</h1>
            <p class="mt-3 text-lg text-gray-300">Completa tu información de pago para confirmar tu experiencia</p>
            
            <!-- Cronómetro -->
            <div class="mt-4 inline-flex items-center justify-center space-x-2 bg-neutral-800/70 px-4 py-2 rounded-full border border-neutral-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="font-mono font-bold text-lg" class:text-red-500={tiempoRestante < 60}>
                    {tiempoFormateado}
                </div>
            </div>
            
            <!-- Texto informativo -->
            <p class="mt-2 text-sm text-gray-400">
                {#if tiempoRestante > 60}
                    Tienes {Math.floor(tiempoRestante / 60)} minutos para completar tu pago
                {:else}
                    ¡Menos de un minuto! Completa tu pago ahora
                {/if}
            </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
            <!-- Resumen de Reserva (2/5) -->
            <div class="md:col-span-2">
                <div class="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl shadow-xl overflow-hidden border border-neutral-700">
                    <div class="p-6">
                        <h2 class="text-xl font-bold text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Resumen de Reserva
                        </h2>
                        
                        {#if $reservaStore}
                            <!-- Información Personal -->
                            <div class="mt-5 border-t border-neutral-700 pt-5">
                                <div class="text-green-400 uppercase text-xs font-bold tracking-wider mb-2">Información Personal</div>
                                <div class="space-y-2 text-gray-200">
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Cliente:</span>
                                        <span>{datosPersonales.nombre || 'No especificado'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Correo:</span>
                                        <span>{datosPersonales.correo || 'No especificado'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Teléfono:</span>
                                        <span>{datosPersonales.telefono || 'No especificado'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Detalles de Reserva -->
                            <div class="mt-5 border-t border-neutral-700 pt-5">
                                <div class="text-green-400 uppercase text-xs font-bold tracking-wider mb-2">Detalles de Reserva</div>
                                <div class="space-y-2 text-gray-200">
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Tipo:</span>
                                        <span>{$reservaStore.grupo ? 'Grupo' : 'Individual'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Personas:</span>
                                        <span>{$reservaStore.cantidad_grupo || 1}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Fecha:</span>
                                        <span>{new Date($reservaStore.fecha_reserva).toLocaleDateString() || 'No definida'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Resumen de Costos -->
                            <div class="mt-6 border-t border-neutral-700 pt-4">
                                <div class="flex justify-between mb-2">
                                    <span class="text-gray-300">Precio por persona:</span>
                                    <span class="text-gray-300">{formatoMoneda($reservaStore.precio_unitario)}</span>
                                </div>
                                <div class="flex justify-between mb-2">
                                    <span class="text-gray-300">Personas:</span>
                                    <span class="text-gray-300">x {$reservaStore.cantidad_grupo || 1}</span>
                                </div>
                                <div class="border-t border-neutral-600 my-2 pt-2"></div>
                                <div class="flex justify-between text-lg font-bold">
                                    <span class="text-white">Total:</span>
                                    <span class="text-green-400">{formatoMoneda($reservaStore.total)}</span>
                                </div>
                            </div>
                        {:else}
                            <div class="py-10 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p class="text-gray-400">No hay una reserva activa.</p>
                                <a href="/experiencias" class="mt-3 inline-block text-green-400 hover:text-green-300">
                                    Ver experiencias disponibles →
                                </a>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
            
            <!-- Formulario de Pago (3/5) -->
            <div class="md:col-span-3">
                <div class="bg-neutral-800 rounded-xl shadow-lg p-6 border border-neutral-700">
                    <h2 class="text-xl font-bold text-white mb-6 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Información de Pago
                    </h2>
                    
                    {#if !guardadoPago}
                        <!-- Selector de Método de Pago -->
                        <div class="mb-6">
                            <div class="flex space-x-4 mb-4">
                                <label class="flex-1 flex items-center justify-center p-4 rounded-lg border border-neutral-600 bg-neutral-700/50 cursor-pointer transition-all hover:bg-neutral-700" class:ring-2={formaPago === 'tarjeta'} class:ring-green-400={formaPago === 'tarjeta'}>
                                    <input type="radio" bind:group={formaPago} value="tarjeta" class="sr-only" />
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <span class="text-white">Tarjeta</span>
                                </label>
                                <label class="flex-1 flex items-center justify-center p-4 rounded-lg border border-neutral-600 bg-neutral-700/50 cursor-pointer transition-all hover:bg-neutral-700" class:ring-2={formaPago === 'transferencia'} class:ring-green-400={formaPago === 'transferencia'}>
                                    <input type="radio" bind:group={formaPago} value="transferencia" class="sr-only" />
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    <span class="text-white">Transferencia</span>
                                </label>
                            </div>
                        </div>
                        
                        {#if formaPago === 'tarjeta'}
                            <!-- Componente de Pago con Stripe -->
                            <StripePayment 
                                amount={totalMXN}
                                currency="mxn"
                                metadata={{
                                    reserva_id: $reservaStore?.id || 'temp',
                                    cliente_nombre: datosPersonales.nombre || '',
                                    cliente_email: datosPersonales.correo || '',
                                    cliente_telefono: datosPersonales.telefono || '',
                                    experiencia_id: $reservaStore?.experiencia_id || '',
                                    cantidad_personas: $reservaStore?.cantidad_grupo || 1,
                                    fecha_reserva: $reservaStore?.fecha_reserva || '',
                                    sesion_activa: sesionActiva
                                }}
                                onPaymentSuccess={handlePaymentSuccess}
                                onPaymentError={handlePaymentError}
                            />
                            
                            <div class="flex items-center justify-center mt-4 text-sm text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Pago seguro con encriptación SSL - Stripe
                            </div>
                            
                            <div class="mt-2 text-xs text-gray-400 text-center">
                                Procesado de forma segura con Stripe • Pagos en pesos mexicanos
                            </div>
                        {:else}
                            <!-- Instrucciones para Transferencia -->
                            <div class="bg-neutral-700/50 rounded-lg p-4 border border-neutral-600">
                                <h3 class="font-bold text-white mb-3">Transferencia Bancaria</h3>
                                <div class="space-y-3">
                                    <div>
                                        <div class="text-sm text-gray-400">Banco:</div>
                                        <div class="text-white">BBVA</div>
                                    </div>
                                    <div>
                                        <div class="text-sm text-gray-400">Titular:</div>
                                        <div class="text-white">Nativo Eco Tours SA de CV</div>
                                    </div>
                                    <div>
                                        <div class="text-sm text-gray-400">CLABE:</div>
                                        <div class="text-white">012 345 6789 0123 45</div>
                                    </div>
                                    <div>
                                        <div class="text-sm text-gray-400">Referencia:</div>
                                        <div class="text-white">RES-{$reservaStore?.experiencia_id || '000'}-{new Date().getTime().toString().slice(-6)}</div>
                                    </div>
                                </div>
                                
                                <div class="mt-6">
                                    <button
                                        on:click={procesarPago}
                                        class="w-full px-4 py-3 flex items-center justify-center rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        disabled={loadingPago}
                                    >
                                        {#if loadingPago}
                                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Procesando...
                                        {:else}
                                            Confirmar Reserva
                                        {/if}
                                    </button>
                                </div>
                            </div>
                        {/if}
                    {:else}
                        <!-- Confirmación -->
                        <div class="text-center py-6">
                            <div class="rounded-full bg-green-600/20 w-20 h-20 mx-auto flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold text-white mb-2">¡Reserva Confirmada!</h3>
                            <p class="text-gray-300">Hemos enviado un correo con los detalles de tu reserva a {$reservaStore?.correo_cliente || 'tu correo'}</p>
                            
                            <div class="mt-8 space-y-3">
                                <a href="/mis-reservas" class="block w-full px-4 py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
                                    Ver Mis Reservas
                                </a>
                                <a href="/experiencias" class="block w-full px-4 py-3 rounded-md bg-neutral-700 text-white font-medium hover:bg-neutral-600 transition-colors">
                                    Explorar Más Experiencias
                                </a>
                            </div>
                        </div>
                    {/if}
                </div>
                
                <!-- Garantía -->
                <div class="mt-6 flex items-start bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                        <h4 class="font-medium text-white">Garantía de satisfacción</h4>
                        <p class="text-sm text-gray-400">Puedes cancelar hasta 48 horas antes de tu experiencia y recibir un reembolso del 80%.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>