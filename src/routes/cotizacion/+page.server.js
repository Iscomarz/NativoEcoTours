import { getUbicaciones } from "$lib/core/controllers/ubicaciones.service";

export async function load() {
    const ubicaciones =  await getUbicaciones();
    return {
        ubicaciones
    };
}

/**
 * Genera el mensaje formateado para WhatsApp
 */
function generarMensajeWhatsApp(formData) {
    const menoresTexto = formData.menores.length > 0 
        ? formData.menores.map(m => `  - ${m.nombre} (${m.edad} años)`).join('\n')
        : '  Ninguno';

    const mensaje = `
🌿 *NUEVA SOLICITUD DE COTIZACIÓN - NATIVO ECO TOURS* 🌿

━━━━━━━━━━━━━━━━━━━━━
👥 *GRUPO DE VIAJE*
━━━━━━━━━━━━━━━━━━━━━
• Adultos: ${formData.adultos}
• Menores: ${formData.menores.length}
${menoresTexto}
• Tipo de viaje: ${formData.tipoViaje || 'No especificado'}
${formData.vehiculoRenta !== null ? `• Vehículo de renta: ${formData.vehiculoRenta ? 'Sí, pueden manejar' : 'No, prefieren chofer'}` : ''}

━━━━━━━━━━━━━━━━━━━━━
📍 *DESTINO Y FECHAS*
━━━━━━━━━━━━━━━━━━━━━
• Destino: ${formData.destinos || 'No especificado'}
• Llegada: ${formData.fechaLlegada || 'Por definir'}
• Salida: ${formData.fechaSalida || 'Por definir'}

━━━━━━━━━━━━━━━━━━━━━
🏨 *PREFERENCIAS*
━━━━━━━━━━━━━━━━━━━━━
• Hospedaje: ${formData.hospedaje || 'No especificado'}
• Transporte: ${formData.transporte || 'No especificado'}
• Experiencias: ${formData.experiencias.length > 0 ? formData.experiencias.join(', ') : 'No especificado'}
• Presupuesto: ${formData.presupuesto || 'Por definir'}

━━━━━━━━━━━━━━━━━━━━━
👤 *DATOS DE CONTACTO*
━━━━━━━━━━━━━━━━━━━━━
• Nombre: ${formData.nombre}
• Email: ${formData.email}
• Teléfono: ${formData.telefono}
${formData.comentarios ? `\n💬 *Comentarios adicionales:*\n${formData.comentarios}` : ''}

━━━━━━━━━━━━━━━━━━━━━
✨ _Solicitud generada desde nativoecotours.com_
    `.trim();

    return mensaje;
}

export const actions = {
    generarWhatsApp: async ({ request }) => {
        const data = await request.formData();
        const formDataJSON = JSON.parse(data.get('formData'));
        
        const numeroWhatsApp = '5216146029050'; // Número en formato internacional sin +
        const mensaje = generarMensajeWhatsApp(formDataJSON);
        const mensajeCodificado = encodeURIComponent(mensaje);
        
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
        
        return {
            success: true,
            urlWhatsApp
        };
    }
};