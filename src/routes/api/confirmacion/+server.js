import { json } from '@sveltejs/kit';
import { sendConfirmationEmail } from '$lib/server/email.js';

export async function POST({ request }) {
    try {
        const { reserva } = await request.json();

        if (!reserva || !reserva.correo_cliente) {
            return json({ success: false, message: 'Datos de reserva incompletos' }, { status: 400 });
        }

        const result = await sendConfirmationEmail(reserva);

        if (result.success) {
            return json({ success: true, data: result.data });
        } else {
            return json({ success: false, error: result.error }, { status: 500 });
        }
    } catch (error) {
        console.error('Error en API confirmacion:', error);
        return json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
    }
}
