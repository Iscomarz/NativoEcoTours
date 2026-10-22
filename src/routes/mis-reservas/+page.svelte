<script>
    import { getReservasByGuest } from '$lib/core/controllers/reservas.service.js';
    import { toast, Toaster } from 'svelte-sonner';
    import { fade, slide } from 'svelte/transition';

    let nombre = '';
    let correo = '';
    let loading = false;
    let searched = false;
    let reservations = [];

    async function handleSearch() {
        if (!nombre || !correo) {
            toast.error('Por favor ingresa tu nombre y correo');
            return;
        }

        try {
            loading = true;
            reservations = await getReservasByGuest(nombre, correo);
            searched = true;
            if (reservations.length === 0) {
                toast.info('No se encontraron reservas activas con esos datos');
            } else {
                toast.success(`Se encontraron ${reservations.length} reserva(s)`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error al buscar tus reservas');
        } finally {
            loading = false;
        }
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    }
</script>

<svelte:head>
	<title>Mis Reservas | Nativo Eco Tours</title>
</svelte:head>

<Toaster />

<div class="min-h-screen bg-[#050505] text-white pt-28 pb-20 px-4">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12" in:fade={{ duration: 800 }}>
            <h1 class="text-3xl md:text-4xl font-extralight tracking-[0.2em] uppercase mb-4">Mis Reservas</h1>
            <p class="text-white/40 font-light tracking-widest text-xs uppercase">Rastrea tus experiencias próximas</p>
            <div class="w-12 h-[1px] bg-green-500/50 mx-auto mt-6"></div>
        </div>

        <!-- Search Form -->
        <div class="bg-white/[0.02] border border-white/10 p-8 rounded-2xl backdrop-blur-sm mb-12 shadow-2xl">
            <form on:submit|preventDefault={handleSearch} class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label for="nombre" class="text-[10px] uppercase tracking-[0.2em] text-white/50 ml-1">Nombre Completo</label>
                    <input 
                        type="text" 
                        id="nombre"
                        bind:value={nombre}
                        placeholder="Como aparece en tu reserva"
                        class="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder:text-white/20"
                    />
                </div>
                <div class="space-y-2">
                    <label for="correo" class="text-[10px] uppercase tracking-[0.2em] text-white/50 ml-1">Correo Electrónico</label>
                    <input 
                        type="email" 
                        id="correo"
                        bind:value={correo}
                        placeholder="ejemplo@correo.com"
                        class="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder:text-white/20"
                    />
                </div>
                <div class="md:col-span-2 mt-2">
                    <button 
                        type="submit"
                        disabled={loading}
                        class="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-green-500 hover:text-white transition-all duration-500 uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                    >
                        {#if loading}
                            Buscando...
                        {:else}
                            Rastrear Reserva
                        {/if}
                    </button>
                </div>
            </form>
        </div>

        <!-- Results -->
        {#if searched}
            <div class="space-y-6" in:fade>
                {#if reservations.length > 0}
                    {#each reservations as res (res.id)}
                        {@const pagado = res.dplazo?.filter(p => p.pagado).reduce((acc, p) => acc + Number(p.monto || 0), 0) || (res.fecha_liquidacion ? res.total : (res.mpago?.[0]?.monto_total || 0))}
                        {@const faltante = Math.max(0, (res.total || 0) - pagado)}
                        {@const isLiquidada = res.estatus_id === 1 || Boolean(res.fecha_liquidacion) || (faltante === 0 && pagado > 0)}
                        {@const whatsappUrl = Array.isArray(res.cexperiencia?.dexperiencia) 
                            ? res.cexperiencia.dexperiencia[0]?.grupo_whatsapp 
                            : res.cexperiencia?.dexperiencia?.grupo_whatsapp || res.cexperiencia?.whatsapp_link || ''}

                        <div class="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 shadow-xl" in:slide>
                            <div class="p-6 md:p-8">
                                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <div>
                                        <div class="flex items-center gap-3 mb-2">
                                            {#if isLiquidada}
                                                <span class="bg-green-500/20 text-green-400 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm border border-green-500/20">
                                                    Reserva Liquidada (Confirmada)
                                                </span>
                                            {:else}
                                                <span class="bg-blue-500/20 text-blue-400 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm border border-blue-500/20">
                                                    A Plazos (Pendiente de Liquidar)
                                                </span>
                                            {/if}
                                            <span class="text-white/30 text-[10px] tracking-widest uppercase">ID: #{res.id.toString().slice(-6)}</span>
                                        </div>
                                        <h2 class="text-xl font-light tracking-wider">{res.cexperiencia.titulo}</h2>
                                    </div>
                                    <div class="text-right">
                                        {#if isLiquidada}
                                            <p class="text-[10px] uppercase tracking-widest text-white/40 mb-1">Total Pagado</p>
                                            <p class="text-xl font-light text-green-400 tracking-wider font-mono">{formatCurrency(res.total)}</p>
                                        {:else}
                                            <p class="text-[10px] uppercase tracking-widest text-white/40 mb-1">Anticipo / Total</p>
                                            <p class="text-lg font-light text-green-400 tracking-wider font-mono">
                                                {formatCurrency(pagado)} <span class="text-xs text-white/30 font-sans">/ {formatCurrency(res.total)}</span>
                                            </p>
                                            <p class="text-[10px] uppercase tracking-widest text-amber-400/90 mt-0.5">
                                                Resta: {formatCurrency(faltante)}
                                            </p>
                                        {/if}
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-y border-white/5">
                                    <div class="space-y-1">
                                        <p class="text-[10px] uppercase tracking-widest text-white/30">Fecha de Viaje</p>
                                        <p class="text-sm font-light uppercase tracking-wide">{formatDate(res.cexperiencia.fecha_inicio)}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-[10px] uppercase tracking-widest text-white/30">Personas</p>
                                        <p class="text-sm font-light">{res.cantidad_grupo} {res.grupo ? 'Invitados' : 'Persona'}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-[10px] uppercase tracking-widest text-white/30">Lugar</p>
                                        <p class="text-sm font-light uppercase tracking-wide">Chihuahua, México</p>
                                    </div>
                                </div>

                                <div class="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    {#if isLiquidada}
                                        {#if whatsappUrl}
                                            <a 
                                                href={whatsappUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                class="px-4 py-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[10px] uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all flex items-center gap-2 rounded-sm"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
                                                Unirse al Grupo de WhatsApp
                                            </a>
                                        {/if}
                                    {:else}
                                        <div class="flex items-center gap-2 text-white/50 text-[10px] uppercase tracking-widest bg-white/[0.02] border border-white/10 px-3.5 py-2 rounded-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400/90"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                            <span>El grupo de WhatsApp se habilitará al liquidar tu reserva</span>
                                        </div>
                                        {#if res.usuario_id}
                                            <a href="/perfil" class="text-[10px] uppercase tracking-widest text-green-400 hover:text-green-300 transition-colors border-b border-green-500/30 pb-0.5">
                                                Liquidar en Mi Perfil &rarr;
                                            </a>
                                        {/if}
                                    {/if}

                                    <div class="flex items-center gap-2 ml-auto text-[10px] text-white/30 uppercase tracking-widest font-extralight">
                                        <span>Presenta tu identificación al llegar</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <div class="text-center py-20 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
                        <div class="mb-4 opacity-20">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-light tracking-widest uppercase mb-1">Sin resultados</h3>
                        <p class="text-xs text-white/30 font-light">Verifica que tus datos coincidan con los usados al reservar</p>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    :global(body) {
        background-color: #050505;
    }
</style>
