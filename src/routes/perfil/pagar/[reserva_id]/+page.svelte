<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
    import { toast, Toaster } from 'svelte-sonner';
    import { goto } from '$app/navigation';
    import StripePayment from '$lib/components/pagos/StripePayment.svelte';
    import { createPago, createPlazo } from '$lib/core/controllers/reservas.service.js';
    import { supabase } from '$lib/core/supabase/client';

    export let data;
    
    let reserva = null;
    let loading = true;
    let guardado = false;
    let session = data.session;
    
    $: reservaId = $page.params.reserva_id;

    onMount(async () => {
        if (!session) {
            goto('/login');
            return;
        }

        const { data: resData, error } = await supabase
            .from('mreserva')
            .select('*, dplazo(*), cexperiencia(titulo, fecha_inicio, dexperiencia(grupo_whatsapp))')
            .eq('id', reservaId)
            .eq('usuario_id', session.user.id)
            .single();

        if (error || !resData) {
            toast.error('No se pudo encontrar la reserva');
            goto('/perfil');
            return;
        }

        reserva = resData;
        loading = false;
    });

    $: paidAmount = reserva?.dplazo?.filter(p => p.pagado).reduce((acc, p) => acc + Number(p.monto), 0) || 0;
    $: remainingAmount = (reserva?.total || 0) - paidAmount;
    
    // Monto editable por el usuario
    let userAmount = 0;
    let dataLoaded = false;

    $: if (!dataLoaded && !loading && remainingAmount > 0) {
        userAmount = remainingAmount;
        dataLoaded = true;
    }

    function formulaMoneda(valor) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(valor || 0);
    }

    async function handlePaymentSuccess(paymentIntent) {
        try {
            // 1. Crear registro de pago
            await createPago({
                reserva_id: reserva.id,
                fecha_pago: new Date().toISOString(),
                monto_total: userAmount,
                completado: true,
                payment_intent_id: paymentIntent.id,
                payment_status: paymentIntent.status || 'succeeded'
            });

            // 2. Crear siguiente plazo
            const lastNumero = Math.max(...(reserva.dplazo?.map(p => p.numero_plazo) || [0]));
            await createPlazo({
                id_reserva: reserva.id,
                numero_plazo: lastNumero + 1,
                monto: userAmount,
                fecha_vencimiento: new Date().toISOString(),
                pagado: true,
                fecha_pago: new Date().toISOString()
            });

            // 3. Si se liquidó todo, actualizar reserva
            if (userAmount >= remainingAmount) {
                await supabase
                    .from('mreserva')
                    .update({ fecha_liquidacion: new Date().toISOString() })
                    .eq('id', reserva.id);

                // Enviar correo de confirmación final
                fetch('/api/confirmacion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        reserva: {
                            nombre_cliente: reserva.nombre_cliente || session.user.user_metadata?.full_name || '',
                            correo_cliente: reserva.correo_cliente || session.user.email,
                            nombreExperiencia: reserva.cexperiencia?.titulo || '',
                            fecha_reserva: reserva.fecha_reserva || new Date(),
                            cantidad_grupo: reserva.cantidad_grupo,
                            grupo: reserva.grupo,
                            id: reserva.id,
                            whatsappLink: Array.isArray(reserva.cexperiencia?.dexperiencia) 
                                ? reserva.cexperiencia.dexperiencia[0]?.grupo_whatsapp 
                                : reserva.cexperiencia?.dexperiencia?.grupo_whatsapp || '',
                            fecha_inicio: reserva.cexperiencia?.fecha_inicio
                        } 
                    })
                }).catch(err => console.error('Error enviando correo:', err));
            }

            guardado = true;
            toast.success('Pago realizado con éxito');
            setTimeout(() => goto('/perfil'), 3000);
        } catch (error) {
            console.error('Error procesando el pago:', error);
            toast.error('Error al registrar el pago en el sistema.');
        }
    }

    function handlePaymentError(error) {
        toast.error(`Error en el pago: ${error.message}`);
    }
</script>

<Toaster position="bottom-right" />

<div class="min-h-screen bg-black py-20 px-4">
    <div class="max-w-xl mx-auto">
        <div class="mb-12 text-center">
            <p class="text-xs text-white/30 font-extralight tracking-[0.4em] uppercase mb-2">Pago de Plazo</p>
            <h1 class="text-2xl font-extralight tracking-widest text-white uppercase">{reserva?.cexperiencia?.titulo || 'Cargando...'}</h1>
        </div>

        {#if loading}
            <div class="flex justify-center p-12">
                <div class="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
            </div>
        {:else if !guardado}
            <div class="bg-white/5 border border-white/10 p-8">
                <div class="mb-8 flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                        <p class="text-[10px] text-white/30 uppercase tracking-widest mb-1">Saldo Pendiente</p>
                        <p class="text-3xl font-extralight text-white tracking-widest">
                            {formulaMoneda(remainingAmount)}
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] text-white/30 uppercase tracking-widest mb-1">Total Reserva</p>
                        <p class="text-sm font-light text-white/60 tracking-widest">
                            {formulaMoneda(reserva.total)}
                        </p>
                    </div>
                </div>

                <!-- Input de monto -->
                <div class="mb-8 p-6 bg-white/[0.02] border border-white/5">
                    <label for="monto" class="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-4 block font-medium">¿Cuánto deseas pagar hoy?</label>
                    <div class="relative group">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xl transition-colors group-focus-within:text-green-400">$</span>
                        <input 
                            type="number" 
                            id="monto"
                            bind:value={userAmount} 
                            max={remainingAmount}
                            min="1"
                            class="w-full bg-white/5 border border-white/10 p-5 pl-10 text-2xl font-extralight text-white tracking-widest focus:border-green-400/50 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                    {#if userAmount > remainingAmount}
                        <p class="text-[10px] text-red-400 mt-2 uppercase tracking-widest font-light animate-pulse">
                            El monto excede el saldo pendiente ({formulaMoneda(remainingAmount)})
                        </p>
                    {:else if userAmount <= 0}
                        <p class="text-[10px] text-white/30 mt-2 uppercase tracking-widest font-light">
                            Ingresa un monto válido para continuar.
                        </p>
                    {/if}
                </div>

                <div class="mb-8">
                    <div class="flex items-center gap-2 text-red-400/60 mb-6 bg-red-400/5 p-4 border border-red-400/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p class="text-[10px] uppercase tracking-widest leading-relaxed">
                            Recuerda: Debes liquidar antes de {new Date(reserva.cexperiencia.fecha_inicio).toLocaleDateString()}.
                        </p>
                    </div>

                    {#if userAmount > 0 && userAmount <= remainingAmount}
                        <StripePayment 
                            amount={userAmount}
                            currency="mxn"
                            metadata={{
                                reserva_id: reserva.id,
                                tipo_pago: 'plazo',
                                numero_plazo: (reserva.dplazo?.length || 0) + 1
                            }}
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
                        />
                    {:else}
                        <div class="w-full py-4 border border-white/5 bg-white/[0.01] text-center opacity-50 grayscale">
                            <span class="text-[10px] text-white/30 uppercase tracking-widest">Esperando monto válido...</span>
                        </div>
                    {/if}
                </div>

                <button on:click={() => goto('/perfil')} class="w-full text-xs text-white/20 uppercase tracking-widest font-extralight hover:text-white/40 transition-colors">
                    Cancelar y volver
                </button>
            </div>
        {:else}
            <div class="bg-white/5 border border-white/10 p-12 text-center" in:fade>
                <div class="w-16 h-16 mx-auto flex items-center justify-center border border-green-400/30 mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-green-400"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 class="text-xl font-extralight tracking-widest text-white mb-2 uppercase">¡Pago Exitoso!</h3>
                <p class="text-xs text-white/30 font-light tracking-widest">Tu abono ha sido registrado. Redirigiendo a tu perfil...</p>
            </div>
        {/if}
    </div>
</div>
