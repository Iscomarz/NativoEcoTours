import { Resend } from 'resend';
import { RESEND_API_KEY, PUBLIC_WHATSAPP_GROUP_LINK } from '$env/static/private';

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
            from: 'Nativo Eco Tours <reservas@takeovermx.com>', 
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
