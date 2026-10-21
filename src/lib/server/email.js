import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import { PUBLIC_WHATSAPP_GROUP_LINK } from '$env/static/public';

const resend = new Resend(RESEND_API_KEY);

export async function sendConfirmationEmail(reserva) {
    if (!RESEND_API_KEY || RESEND_API_KEY === 're_your_api_key_here') {
        console.warn('Resend API Key no configurada. Saltando envío de correo.');
        return { success: false, message: 'API Key no configurada' };
    }

    try {
        console.log('Reserva:', reserva);
        
        // Calcular días restantes
        const fechaInicio = reserva.fecha_inicio ? new Date(reserva.fecha_inicio) : null;
        const hoy = new Date();
        let diasRestantes = null;
        
        if (fechaInicio) {
            const diffTime = fechaInicio - hoy;
            diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        const { data, error } = await resend.emails.send({
            from: 'Nativo Eco Tours <reservas@nativotravels.com>', 
            to: [reserva.correo_cliente],
            subject: '¡Reserva Confirmada! - ' + reserva.nombreExperiencia,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #050505; color: #ffffff; padding: 40px; border-radius: 16px;">
                    <!-- Logo Header -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="https://pnqbnspshbamsgpgejsx.supabase.co/storage/v1/object/public/logosNativo/logoNativo.png" alt="Nativo Eco Tours" style="width: 200px; height: auto;" />
                    </div>

                    <h1 style="font-weight: 200; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 20px; text-align: center;">¡Bienvenido a la Aventura!</h1>
                    
                    <p style="color: #ffffff; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                        Hola ${reserva.nombre_cliente}, tu reserva ha sido confirmada con éxito. Estamos emocionados de tenerte con nosotros.
                    </p>

                    <div style="background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 25px; border-radius: 12px; margin-bottom: 30px;">
                        <h2 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.4); margin-bottom: 15px;">Detalles de tu Viaje</h2>
                        
                        <div style="margin-bottom: 10px;">
                            <span style="color: rgba(255,255,255,0.4); font-size: 12px;">Experiencia:</span>
                            <div style="font-size: 16px;">${reserva.nombreExperiencia}</div>
                        </div>

                        <div style="margin-bottom: 10px;">
                            <span style="color: rgba(255,255,255,0.4); font-size: 12px;">Fecha de Salida:</span>
                            <div style="font-size: 16px;">${fechaInicio ? fechaInicio.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Próximamente'}</div>
                            ${diasRestantes !== null && diasRestantes > 0 ? `<div style="font-size: 12px; color: #25D366; margin-top: 5px;">¡Faltan solo ${diasRestantes} días para partir!</div>` : ''}
                        </div>

                        <div style="margin-bottom: 0;">
                            <span style="color: rgba(255,255,255,0.4); font-size: 12px;">Personas:</span>
                            <div style="font-size: 16px;">${reserva.cantidad_grupo} ${reserva.grupo ? 'Invitados' : 'Persona'}</div>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 40px;">
                        <p style="font-size: 12px; color: rgba(255,255,255,0.3); margin-bottom: 20px;">Únete a nuestro grupo exclusivo de WhatsApp para coordinar tu viaje con los guías:</p>
                        <a href="${reserva.whatsappLink || PUBLIC_WHATSAPP_GROUP_LINK}" style="background-color: #25D366; color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
                            UNIRSE AL GRUPO DE WHATSAPP
                        </a>
                    </div>

                    <div style="margin-top: 50px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); pt: 30px;">
                        <p style="font-size: 10px; color: rgba(255,255,255,0.2); letter-spacing: 0.1em; text-transform: uppercase;">
                            Nativo Eco Tours - Siente la Naturaleza
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
                        Tu cuenta ha sido activada con éxito. Ya puedes descubrir nuestras experiencias exclusivas en la Sierra Tarahumara y las Barrancas del Cobre.
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
