<script>
    import { reservaStore } from '$lib/stores/reservaStore';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { toast, Toaster } from 'svelte-sonner';
    import StripePayment from '$lib/components/pagos/StripePayment.svelte';
	import { createReserva, createPago, createHabitacionReserva, createPlazo } from '$lib/core/controllers/reservas.service.js';
	import { eliminarBloqueosActivos } from '$lib/core/controllers/habitaciones.service.js';
	import MReserva from '$lib/objects/MReserva';
    
    export let data;
    
    // Datos del servidor
    let sesionActiva = data?.sesionActiva || false;
    let session = data?.session || null;
    let currentReserva = {};
    let formaPago = 'tarjeta'; // tarjeta, transferencia, plazos
    let tarjeta = {
        numero: '',
        nombre: '',
        expiracion: '',
        cvv: ''
    };
    let guardadoPago = false;
    let loadingPago = false;
    let reservaFinalizada = false; // Nueva variable para controlar el mensaje de éxito
    
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
                
                // Liberar bloqueos si existen
                if (currentReserva?.checkout_session_id) {
                    eliminarBloqueosActivos(currentReserva.checkout_session_id);
                }
                
                // Resetear el store
                reservaStore.set({});
                
                // Redirigir a la página de inicio
                goto('/');
                
                // También podrías mostrar un mensaje antes de redirigir
                toast.error('¡Tiempo agotado! Tu reserva ha sido cancelada y los espacios liberados.');
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
            const isPlazos = formaPago === 'plazos';
            const checkoutSessionId = $reservaStore?.checkout_session_id;
            const expectedAmount = isPlazos ? ($reservaStore.total * 0.20) : $reservaStore.total;
            const montoPagado = paymentIntent.amount / 100;

            if (Math.abs(montoPagado - expectedAmount) > 0.01) {
                throw new Error(`El monto cobrado por Stripe (${montoPagado} MXN) no coincide con el monto esperado de la reserva (${expectedAmount} MXN).`);
            }

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
                fecha_liquidacion: isPlazos ? null : new Date(), // Null si es a plazos
                
                // Datos financieros
                total: $reservaStore.total,
                metodo_pago_id: (formaPago === 'tarjeta' || formaPago === 'plazos') ? 1 : 2, // 1=Tarjeta/Stripe, 2=Transferencia
                pago_a_plazos: isPlazos,
                
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
            
            // 4. Crear el registro de pago (por el monto pagado ahora)
            const pagoData = {
                reserva_id: reservaId,
                fecha_pago: new Date().toISOString(),
                monto_total: isPlazos ? ($reservaStore.total * 0.20) : $reservaStore.total,
                completado: true,
                payment_intent_id: paymentIntent.id,
                payment_status: paymentIntent.status || 'succeeded'
            };
            
            const resultadoPago = await createPago(pagoData);

            // 4.5 Si es a plazos, insertar el primer plazo en dplazo
            if (isPlazos) {
                await createPlazo({
                    id_reserva: reservaId,
                    numero_plazo: 1,
                    monto: $reservaStore.total * 0.20,
                    fecha_vencimiento: new Date().toISOString(), // Ya pagado hoy
                    pagado: true,
                    fecha_pago: new Date().toISOString()
                });
            }
            
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
                    }
                }
            }
            
            // 6. Actualizar UI
            guardadoPago = true;

            // 6.5 Limpiar los bloqueos temporales ya que ahora es una reserva fija
            if (checkoutSessionId) {
                await eliminarBloqueosActivos(checkoutSessionId);
            }
            
            // 7. Actualizar store con datos finales (incluyendo ID de la DB)
            reservaStore.update(reserva => ({
                ...reserva,
                id: reservaId,
                payment_intent_id: paymentIntent.id,
                payment_status: paymentIntent.status || 'succeeded',
                status: isPlazos ? 'pago_parcial' : 'pagado',
                fecha_pago: new Date().toISOString(),
                completado: true
            }));

            // 8. Enviar correo de confirmación (Pago único o plazos completados)
            const pagoCompletado = !isPlazos || (montoPagado >= $reservaStore.total);
            reservaFinalizada = pagoCompletado; // Guardamos el estado para la UI
            
            if (pagoCompletado) {
                fetch('/api/confirmacion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        reserva: {
                            nombre_cliente: datosPersonales.nombre,
                            correo_cliente: datosPersonales.correo,
                            nombreExperiencia: $reservaStore.nombreExperiencia,
                            fecha_reserva: $reservaStore.fecha_reserva || new Date(),
                            cantidad_grupo: $reservaStore.cantidad_grupo,
                            grupo: $reservaStore.grupo,
                            id: reservaId,
                            whatsappLink: $reservaStore.whatsappLink,
                            fecha_inicio: $reservaStore.fecha_inicio
                        } 
                    })
                }).catch(err => console.error('Error enviando correo:', err));
            }
            
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
            } else if (error.message.includes('plazo')) {
                errorMessage = 'Error al registrar el primer plazo';
            } else {
                errorMessage = error.message;
            }
            
            toast.error(`${errorMessage}. El pago fue exitoso, pero contacta al soporte para verificar tu reserva.`);
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

<div class="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
        <!-- Encabezado -->
        		<div class="text-center mb-12">
			<p class="text-xs text-white/30 font-extralight tracking-[0.4em] uppercase mb-2">Resumen</p>
			<h1 class="text-2xl font-extralight tracking-widest text-white">Finalizar Reserva</h1>
			<p class="mt-2 text-xs font-extralight text-white/30 tracking-wide">Completa tu información de pago para confirmar tu experiencia</p>
			
			<!-- Cronómetro -->
			<div class="mt-4 inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-4 py-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<div class="font-mono font-extralight text-sm tracking-widest" class:text-red-400={tiempoRestante < 60} class:text-white={tiempoRestante >= 60}>
					{tiempoFormateado}
				</div>
			</div>
			
			<p class="mt-2 text-xs text-white/20 font-extralight tracking-wide">
				{#if tiempoRestante > 60}
					{Math.floor(tiempoRestante / 60)} minutos para completar tu pago
				{:else}
					¡Menos de un minuto! Completa tu pago ahora
				{/if}
			</p>
		</div>
        
        <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
            			<!-- Resumen de Reserva -->
			<div class="md:col-span-2">
				<div class="bg-white/5 border border-white/10 p-6">
                        					<h2 class="text-xs font-light text-white/50 tracking-[0.35em] uppercase flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
						Resumen de Reserva
					</h2>
                        
                        {#if $reservaStore}
                            						<div class="mt-5 border-t border-white/10 pt-5">
							<div class="text-white/30 uppercase text-xs font-extralight tracking-[0.35em] mb-3">Información Personal</div>
							<div class="space-y-2">
								<div class="flex justify-between">
									<span class="text-xs text-white/30 font-extralight">Cliente</span>
									<span class="text-xs text-white/60 font-extralight">{datosPersonales.nombre || 'No especificado'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-xs text-white/30 font-extralight">Correo</span>
									<span class="text-xs text-white/60 font-extralight">{datosPersonales.correo || 'No especificado'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-xs text-white/30 font-extralight">Teléfono</span>
									<span class="text-xs text-white/60 font-extralight">{datosPersonales.telefono || 'No especificado'}</span>
								</div>
							</div>
						</div>
                            
                            						<div class="mt-5 border-t border-white/10 pt-5">
							<div class="text-white/30 uppercase text-xs font-extralight tracking-[0.35em] mb-3">Detalles de Reserva</div>
							<div class="space-y-2">
								<div class="flex justify-between">
									<span class="text-xs text-white/30 font-extralight">Tipo</span>
									<span class="text-xs text-white/60 font-extralight">{$reservaStore.grupo ? 'Grupo' : 'Individual'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-xs text-white/30 font-extralight">Personas</span>
									<span class="text-xs text-white/60 font-extralight">{$reservaStore.cantidad_grupo || 1}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-xs text-white/30 font-extralight">Fecha</span>
									<span class="text-xs text-white/60 font-extralight">{new Date($reservaStore.fecha_reserva).toLocaleDateString() || 'No definida'}</span>
								</div>
							</div>
						</div>
                            
                            						<div class="mt-6 border-t border-white/10 pt-4 space-y-2">
							<div class="flex justify-between">
								<span class="text-xs text-white/30 font-extralight">Precio por persona</span>
								<span class="text-xs text-white/50 font-extralight">{formatoMoneda($reservaStore.precio_unitario)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-xs text-white/30 font-extralight">Personas</span>
								<span class="text-xs text-white/50 font-extralight">x {$reservaStore.cantidad_grupo || 1}</span>
							</div>
							<div class="border-t border-white/10 pt-3 flex justify-between items-center">
								<span class="text-xs text-white/50 font-extralight tracking-widest uppercase">Total</span>
								<span class="text-lg font-extralight text-green-400 tracking-widest">{formatoMoneda($reservaStore.total)}</span>
							</div>
						</div>
                        {:else}
                            						<div class="py-8 text-center">
							<p class="text-xs text-white/20 font-extralight tracking-widest">No hay una reserva activa.</p>
							<a href="/experiencias" class="mt-3 inline-block text-xs text-green-400 font-extralight tracking-widest hover:text-green-300 transition-colors">
								Ver experiencias →
							</a>
						</div>
                        {/if}
				</div>
			</div>
            
            <!-- Formulario de Pago -->
			<div class="md:col-span-3">
				<div class="bg-white/5 border border-white/10 p-6">
					<h2 class="text-xs font-light text-white/50 tracking-[0.35em] uppercase flex items-center gap-2 mb-6">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
						</svg>
						Información de Pago
					</h2>
                    
                    {#if !guardadoPago}
						<!-- Selector método de pago -->
						<div class="mb-6">
							<div class="flex flex-wrap gap-3 mb-4">
								<label class={`flex-1 min-w-[120px] flex items-center justify-center gap-2 p-3 border cursor-pointer transition-all hover:bg-white/10 ${formaPago === 'tarjeta' ? 'border-white bg-white/10' : 'border-white/10 bg-white/5'}`}>
									<input type="radio" bind:group={formaPago} value="tarjeta" class="sr-only" />
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
									</svg>
									<span class="text-xs font-extralight tracking-widest text-white/60">Tarjeta</span>
								</label>

								{#if sesionActiva}
									<label class={`flex-1 min-w-[120px] flex items-center justify-center gap-2 p-3 border cursor-pointer transition-all hover:bg-white/10 ${formaPago === 'plazos' ? 'border-green-400 bg-green-400/10' : 'border-white/10 bg-white/5'}`}>
										<input type="radio" bind:group={formaPago} value="plazos" class="sr-only" />
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										<span class="text-xs font-extralight tracking-widest text-white/60">A Plazos (20%)</span>
									</label>
								{/if}


								<!-- <label class={`flex-1 min-w-[120px] flex items-center justify-center gap-2 p-3 border cursor-pointer transition-all hover:bg-white/10 ${formaPago === 'transferencia' ? 'border-white bg-white/10' : 'border-white/10 bg-white/5'}`}>
									<input type="radio" bind:group={formaPago} value="transferencia" class="sr-only" />
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
									</svg>
									<span class="text-xs font-extralight tracking-widest text-white/60">Transferencia</span>
								</label> -->
							</div>
						</div>
                        
                        {#if formaPago === 'tarjeta' || formaPago === 'plazos'}
                            <!-- Componente de Pago con Stripe -->
                            <div class="mb-4">
                                {#if formaPago === 'plazos'}
                                    <div class="bg-green-400/5 border border-green-400/20 p-4 mb-4">
                                        <p class="text-[10px] text-green-400 uppercase tracking-widest font-light mb-1">Pago Inicial (20%)</p>
                                        <p class="text-xl font-extralight text-white tracking-widest">{formatoMoneda($reservaStore.total * 0.20)}</p>
                                        <p class="text-[10px] text-white/30 mt-2 leading-relaxed">Paga el 20% ahora y liquida el resto antes de tu llegada.</p>
                                    </div>
                                {/if}
                                <StripePayment 
                                    amount={formaPago === 'plazos' ? totalMXN * 0.20 : totalMXN}
                                    currency="mxn"
                                    metadata={{
                                        reserva_id: $reservaStore?.id || 'temp',
                                        cliente_nombre: datosPersonales.nombre || '',
                                        cliente_email: datosPersonales.correo || '',
                                        cliente_telefono: datosPersonales.telefono || '',
                                        experiencia_id: $reservaStore?.experiencia_id || '',
                                        cantidad_personas: $reservaStore?.cantidad_grupo || 1,
                                        fecha_reserva: $reservaStore?.fecha_reserva || '',
                                        sesion_activa: sesionActiva,
                                        pago_a_plazos: formaPago === 'plazos'
                                    }}
                                    onPaymentSuccess={handlePaymentSuccess}
                                    onPaymentError={handlePaymentError}
                                />
                            </div>
                            
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
							<!-- Instrucciones Transferencia -->
							<div class="bg-white/5 border border-white/10 p-5">
								<h3 class="text-xs font-light text-white/50 tracking-[0.35em] uppercase mb-4">Transferencia Bancaria</h3>
								<div class="space-y-3">
									<div><div class="text-xs text-white/30 font-extralight mb-0.5">Banco</div><div class="text-xs text-white/60 font-extralight">BBVA</div></div>
									<div><div class="text-xs text-white/30 font-extralight mb-0.5">Titular</div><div class="text-xs text-white/60 font-extralight">Nativo Eco Tours SA de CV</div></div>
									<div><div class="text-xs text-white/30 font-extralight mb-0.5">CLABE</div><div class="text-xs text-white/60 font-extralight">012 345 6789 0123 45</div></div>
									<div><div class="text-xs text-white/30 font-extralight mb-0.5">Referencia</div><div class="text-xs text-white/60 font-extralight">RES-{$reservaStore?.experiencia_id || '000'}-{new Date().getTime().toString().slice(-6)}</div></div>
								</div>
								<div class="mt-6">
									<button on:click={procesarPago}
										class="w-full bg-white/5 border border-white/20 hover:bg-white/10 px-4 py-3 text-xs font-extralight tracking-[0.3em] uppercase text-white transition-all duration-300 disabled:opacity-30"
										disabled={loadingPago}>
										{#if loadingPago}
											<svg class="animate-spin h-4 w-4 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										{:else}
											Confirmar Reserva
										{/if}
									</button>
								</div>
							</div>
                        {/if}
                    {:else}
						<!-- Confirmación -->
						<div class="text-center py-10">
							<div class="w-16 h-16 mx-auto flex items-center justify-center border border-green-400/30 mb-6">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<p class="text-xs text-white/30 font-extralight tracking-[0.4em] uppercase mb-2">
                                {reservaFinalizada ? 'Confirmada' : 'Recibida'}
                            </p>
							<h3 class="text-xl font-extralight tracking-widest text-white mb-3">
                                {reservaFinalizada ? '¡Reserva Confirmada!' : '¡Reserva Recibida!'}
                            </h3>
							
                            {#if reservaFinalizada}
                                <p class="text-xs text-white/40 font-extralight">Hemos enviado un correo con los detalles de tu reserva a {$reservaStore?.correo_cliente || 'tu correo'}</p>
                            {:else}
                                <p class="text-xs text-white/40 font-extralight">Tu primer pago se registró con éxito. Revisa tu perfil para liquidar el total y recibir tu confirmación oficial.</p>
                            {/if}

							<div class="mt-8 space-y-3">
								<a href={sesionActiva ? '/perfil' : '/mis-reservas'} class="block w-full bg-white/5 border border-white/20 hover:bg-white/10 px-4 py-3 text-xs font-extralight tracking-[0.3em] uppercase text-white transition-all duration-300">
									Ver Mis Reservas
								</a>
								<a href="/experiencias" class="block w-full bg-transparent border border-white/10 hover:bg-white/5 px-4 py-3 text-xs font-extralight tracking-[0.3em] uppercase text-white/40 transition-all duration-300">
									Explorar Más Experiencias
								</a>
							</div>
						</div>
                    {/if}
                </div>
                
				<!-- Garantía -->
				<div class="mt-4 flex items-start bg-white/5 border border-white/10 p-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white/20 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
					<div>
						<h4 class="text-xs font-light text-white/40 tracking-widest uppercase">Garantía de satisfacción</h4>
						<p class="text-xs text-white/20 font-extralight mt-1 leading-relaxed">Puedes cancelar hasta 48 horas antes de tu experiencia y recibir un reembolso del 80%.</p>
					</div>
				</div>
		</div>
	</div>
</div>
</div>