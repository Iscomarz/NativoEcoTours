import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import { PUBLIC_WHATSAPP_GROUP_LINK } from '$env/static/public';

const resend = new Resend(RESEND_API_KEY);

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount || 0);
}

export async function sendConfirmationEmail(reserva) {
    if (!RESEND_API_KEY || RESEND_API_KEY === 're_your_api_key_here') {
        console.warn('Resend API Key no configurada. Saltando envío de correo.');
        return { success: false, message: 'API Key no configurada' };
    }

    try {
        console.log('Reserva a procesar en email:', reserva);
        
        // Calcular días restantes
        const fechaInicio = reserva.fecha_inicio ? new Date(reserva.fecha_inicio) : null;
        const hoy = new Date();
        let diasRestantes = null;
        
        if (fechaInicio) {
            const diffTime = fechaInicio - hoy;
            diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        const isPlazos = Boolean(reserva.is_plazos) && !reserva.is_liquidacion;
        const isLiquidacion = Boolean(reserva.is_liquidacion);

        let subject = '¡Reserva Confirmada! - ' + (reserva.nombreExperiencia || 'Nativo Eco Tours');
        let title = '¡Bienvenido a la Aventura!';
        let introText = `Hola ${reserva.nombre_cliente || 'Viajero'}, tu reserva ha sido confirmada con éxito. Estamos emocionados de tenerte con nosotros.`;

        if (isLiquidacion) {
            subject = '¡Reserva 100% Liquidada! - ' + (reserva.nombreExperiencia || 'Nativo Eco Tours');
            title = '¡Reserva Liquidada con Éxito!';
            introText = `Hola ${reserva.nombre_cliente || 'Viajero'}, has completado el pago total de tu experiencia. Todo está listo para tu viaje.`;
        } else if (isPlazos) {
            subject = '¡Apartado Confirmado! - ' + (reserva.nombreExperiencia || 'Nativo Eco Tours');
            title = '¡Tu Lugar Está Apartado!';
            introText = `Hola ${reserva.nombre_cliente || 'Viajero'}, hemos recibido tu anticipo con éxito. Tu lugar para la experiencia ya se encuentra apartado.`;
        }

        const fechaLimiteStr = reserva.fecha_limite 
            ? new Date(reserva.fecha_limite).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            : (fechaInicio ? fechaInicio.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : null);

        const { data, error } = await resend.emails.send({
            from: 'Nativo Eco Tours <reservas@nativotravels.com>', 
            to: [reserva.correo_cliente],
            subject: subject,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050505; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);">
                    <!-- Logo Header -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="https://pnqbnspshbamsgpgejsx.supabase.co/storage/v1/object/public/logosNativo/logoNativo.png" alt="Nativo Eco Tours" style="width: 200px; height: auto;" />
                    </div>

                    <h1 style="font-weight: 200; font-size: 24px; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 16px; text-align: center; line-height: 1.3;">${title}</h1>
                    
                    <p style="color: rgba(255,255,255,0.85); font-size: 15px; font-weight: 300; line-height: 1.7; text-align: center; margin-bottom: 32px;">
                        ${introText}
                    </p>

                    <!-- Detalles del Viaje -->
                    <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                        <h2 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.4); margin-top: 0; margin-bottom: 16px;">Detalles de tu Viaje</h2>
                        
                        <div style="margin-bottom: 12px;">
                            <span style="color: rgba(255,255,255,0.4); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Experiencia:</span>
                            <div style="font-size: 16px; font-weight: 400; color: #ffffff; margin-top: 2px;">${reserva.nombreExperiencia}</div>
                        </div>

                        <div style="margin-bottom: 12px;">
                            <span style="color: rgba(255,255,255,0.4); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Fecha de Salida:</span>
                            <div style="font-size: 16px; font-weight: 400; color: #ffffff; margin-top: 2px;">${fechaInicio ? fechaInicio.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Próximamente'}</div>
                            ${diasRestantes !== null && diasRestantes > 0 ? `<div style="font-size: 12px; color: #22c55e; margin-top: 4px;">¡Faltan solo ${diasRestantes} días para partir!</div>` : ''}
                        </div>

                        <div style="margin-bottom: 0;">
                            <span style="color: rgba(255,255,255,0.4); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Personas:</span>
                            <div style="font-size: 16px; font-weight: 400; color: #ffffff; margin-top: 2px;">${reserva.cantidad_grupo || 1} ${reserva.grupo ? 'Invitados' : 'Persona'}</div>
                        </div>
                    </div>

                    ${isPlazos ? `
                    <!-- Resumen Financiero de Plazos -->
                    <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                        <h2 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.4); margin-top: 0; margin-bottom: 16px;">Estado de tu Plan a Plazos</h2>
                        
                        <div style="margin-bottom: 10px; display: flex; justify-content: space-between; font-size: 14px;">
                            <span style="color: rgba(255,255,255,0.5);">Total de la Reserva:</span>
                            <strong style="color: #ffffff;">${formatCurrency(reserva.total)}</strong>
                        </div>
                        <div style="margin-bottom: 10px; display: flex; justify-content: space-between; font-size: 14px;">
                            <span style="color: rgba(255,255,255,0.5);">Anticipo Pagado:</span>
                            <strong style="color: #22c55e;">${formatCurrency(reserva.monto_pagado)}</strong>
                        </div>
                        <div style="margin-bottom: 14px; display: flex; justify-content: space-between; font-size: 14px;">
                            <span style="color: rgba(255,255,255,0.5);">Saldo Restante por Liquidar:</span>
                            <strong style="color: #f59e0b;">${formatCurrency(reserva.monto_pendiente)}</strong>
                        </div>

                        ${fechaLimiteStr ? `
                        <div style="padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.5;">
                            ⚠️ Fecha límite para liquidar tu saldo: <strong style="color: #ffffff;">antes del ${fechaLimiteStr}</strong>.
                        </div>` : ''}
                    </div>

                    <!-- Mensaje informativo WhatsApp bloqueado -->
                    <div style="background-color: rgba(34, 197, 94, 0.05); border: 1px solid rgba(34, 197, 94, 0.2); padding: 20px; border-radius: 12px; text-align: center; margin-top: 28px;">
                        <div style="font-size: 22px; margin-bottom: 8px;">🔒</div>
                        <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: #22c55e; margin: 0 0 8px 0; font-weight: 500;">Grupo Exclusivo de WhatsApp</h3>
                        <p style="font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0; font-weight: 300;">
                            El enlace para unirte al grupo oficial de WhatsApp con los guías de viaje se te compartirá y habilitará automáticamente en cuanto <strong>liquides el total de tu reserva</strong> desde tu perfil.
                        </p>
                    </div>
                    ` : `
                    <!-- Botón Grupo WhatsApp habilitado -->
                    <div style="text-align: center; margin-top: 36px;">
                        <p style="font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 20px; line-height: 1.6;">
                            ${isLiquidacion 
                                ? '¡Tu lugar está 100% asegurado! Únete al grupo exclusivo de WhatsApp para coordinar tu viaje directamente con los guías:' 
                                : 'Únete a nuestro grupo exclusivo de WhatsApp para coordinar tu viaje con los guías y expedicionarios:'}
                        </p>
                        <a href="${reserva.whatsappLink || PUBLIC_WHATSAPP_GROUP_LINK}" style="background-color: #22c55e; color: #000000; padding: 14px 36px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; display: inline-block;">
                            Unirse al Grupo de WhatsApp
                        </a>
                    </div>
                    `}

                    <div style="margin-top: 44px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px;">
                        <p style="font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: 0.2em; text-transform: uppercase; margin: 0 0 6px 0;">
                            Nativo Eco Tours &bull; Chihuahua, México
                        </p>
                        <p style="font-size: 10px; color: rgba(255,255,255,0.2); margin: 0;">
                            Siente la naturaleza. Si necesitas asistencia con tu reserva, responde directamente a este correo.
                        </p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Error enviando correo con Resend:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Catched error en sendConfirmationEmail:', err);
        return { success: false, error: err.message };
    }
}

export async function sendWelcomeEmail({ email, nombre }) {
    if (!RESEND_API_KEY || RESEND_API_KEY === 're_your_api_key_here') {
        console.warn('Resend API Key no configurada. Saltando envío de correo de bienvenida.');
        return { success: false, message: 'API Key no configurada' };
    }

    try {
        const displayName = nombre || 'Viajero';
        const { data, error } = await resend.emails.send({
            from: 'Nativo Eco Tours <reservas@nativotravels.com>',
            to: [email],
            subject: '¡Bienvenido a Nativo Eco Tours!',
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050505; color: #ffffff; padding: 48px 32px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);">
                    <!-- Logo Header -->
                    <div style="text-align: center; margin-bottom: 36px;">
                        <img src="https://pnqbnspshbamsgpgejsx.supabase.co/storage/v1/object/public/logosNativo/logoNativo.png" alt="Nativo Eco Tours" style="width: 180px; height: auto;" />
                    </div>

                    <div style="text-align: center; margin-bottom: 30px;">
                        <p style="color: rgba(255,255,255,0.4); font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; margin: 0 0 12px 0;">NATIVO ECO TOURS</p>
                        <h1 style="font-weight: 200; font-size: 24px; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; line-height: 1.3;">Empieza Tu Aventura</h1>
                        <div style="width: 40px; height: 1px; background-color: rgba(34, 197, 94, 0.6); margin: 18px auto 0 auto;"></div>
                    </div>
                    
                    <p style="color: rgba(255,255,255,0.85); font-size: 15px; font-weight: 300; line-height: 1.8; text-align: center; margin-bottom: 32px;">
                        Hola <strong style="font-weight: 400; color: #ffffff;">${displayName}</strong>, bienvenido a la comunidad Nativo.<br/>
                        Tu cuenta ha sido activada con éxito. Ya puedes descubrir nuestras experiencias exclusivas en Chihuahua y la República Mexicana.
                    </p>

                    <!-- Beneficios -->
                    <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 24px; border-radius: 12px; margin-bottom: 36px;">
                        <h2 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.4); margin: 0 0 16px 0; font-weight: 300;">Con tu cuenta podrás:</h2>
                        
                        <div style="margin-bottom: 12px; font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.7); line-height: 1.6;">
                            &bull; Explorar y reservar experiencias guiadas de aventura y ecoturismo.
                        </div>
                        <div style="margin-bottom: 12px; font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.7); line-height: 1.6;">
                            &bull; Solicitar cotizaciones personalizadas según el tamaño de tu grupo.
                        </div>
                        <div style="margin-bottom: 0; font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.7); line-height: 1.6;">
                            &bull; Rastrear y gestionar todas tus reservas desde tu perfil.
                        </div>
                    </div>

                    <!-- Botón CTA -->
                    <div style="text-align: center; margin-bottom: 40px;">
                        <a href="https://nativotravels.com/experiencias" style="background-color: #22c55e; color: #000000; padding: 14px 36px; text-decoration: none; border-radius: 50px; font-weight: 500; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; display: inline-block;">
                            Explorar Experiencias
                        </a>
                    </div>

                    <!-- Footer -->
                    <div style="margin-top: 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px;">
                        <p style="font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: 0.2em; text-transform: uppercase; margin: 0 0 8px 0;">
                            Nativo Eco Tours &bull; Chihuahua, México
                        </p>
                        <p style="font-size: 10px; color: rgba(255,255,255,0.2); margin: 0;">
                            Siente la naturaleza. Ante cualquier duda, responde a este correo.
                        </p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Error enviando correo de bienvenida con Resend:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Catched error en sendWelcomeEmail:', err);
        return { success: false, error: err.message };
    }
}
