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
                        <div class="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 shadow-xl" in:slide>
                            <div class="p-6 md:p-8">
                                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <div>
                                        <div class="flex items-center gap-3 mb-2">
                                            <span class="bg-green-500/20 text-green-400 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-green-500/20">
                                                Reserva Confirmada
                                            </span>
                                            <span class="text-white/30 text-[10px] tracking-widest uppercase">ID: #{res.id.toString().slice(-6)}</span>
                                        </div>
                                        <h2 class="text-xl font-light tracking-wider">{res.cexperiencia.titulo}</h2>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-[10px] uppercase tracking-widest text-white/40 mb-1">Total Pagado</p>
                                        <p class="text-xl font-light text-green-400 tracking-wider font-mono">{formatCurrency(res.total)}</p>
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

                                <div class="mt-6 flex flex-wrap gap-4 items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p class="text-[10px] text-white/20 uppercase tracking-widest font-extralight">Presenta tu identificación al llegar</p>
                                    </div>
                                    <button class="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-0.5">
                                        Ayuda con mi reserva
                                    </button>
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
