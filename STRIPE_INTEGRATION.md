# Integración de Stripe en NativoEcoTours

## 📋 Resumen de la implementación

Se ha integrado completamente Stripe como procesador de pagos en el proyecto SvelteKit de NativoEcoTours con las siguientes características:

### ✅ Funcionalidades implementadas

1. **Pagos libres**: Los usuarios pueden ingresar cualquier monto para pagar
2. **Stripe Elements**: Interfaz segura y responsive para captura de tarjetas
3. **Webhooks**: Manejo de eventos de Stripe para confirmación de pagos
4. **Estados de pago**: Tracking completo del proceso de pago
5. **Conversión de moneda**: MXN a USD automática
6. **Integración completa**: Funciona con el flujo existente de reservas

## 🔧 Configuración requerida

### 1. Variables de entorno (.env)

Reemplaza los siguientes valores con tus claves reales de Stripe:

```env
# Stripe Configuration
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TU_CLAVE_PUBLICA_AQUI
STRIPE_SECRET_KEY=sk_test_TU_CLAVE_SECRETA_AQUI
STRIPE_WEBHOOK_SECRET=whsec_TU_WEBHOOK_SECRET_AQUI
```

### 2. Obtener las claves de Stripe

1. **Crea una cuenta en [Stripe](https://stripe.com)**
2. **Accede al Dashboard de Stripe**
3. **Ve a Developers > API keys**
4. **Copia las claves:**
   - **Publishable key** → `PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### 3. Configurar Webhooks

1. **Ve a Developers > Webhooks en tu Dashboard de Stripe**
2. **Crea un nuevo endpoint con la URL:**
   ```
   https://tu-dominio.com/api/payments/webhook
   ```
3. **Selecciona los eventos:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
4. **Copia el Webhook Secret** → `STRIPE_WEBHOOK_SECRET`

## 📁 Estructura de archivos creados

```
src/
├── lib/
│   ├── components/
│   │   └── pagos/
│   │       └── StripePayment.svelte       # Componente principal de pago
│   ├── core/
│   │   └── controllers/
│   │       └── stripe.service.js          # Servicio de Stripe
│   └── stores/
│       └── reservaStore.js               # Store actualizado con estados de pago
└── routes/
    └── api/
        └── payments/
            ├── create-intent/
            │   └── +server.js            # Crear Payment Intent
            ├── confirm/
            │   └── +server.js            # Confirmar pago
            └── webhook/
                └── +server.js            # Webhook de Stripe
```

## 🚀 Cómo usar

### 1. En el frontend (Componente)

```svelte
<script>
  import StripePayment from '$lib/components/pagos/StripePayment.svelte';
  
  function handleSuccess(paymentIntent) {
    console.log('Pago exitoso:', paymentIntent);
    // Manejar el éxito del pago
  }
  
  function handleError(error) {
    console.error('Error en pago:', error);
    // Manejar errores
  }
</script>

<StripePayment 
  amount={50.00}
  currency="usd"
  metadata={{
    order_id: "123",
    customer_name: "Juan Pérez"
  }}
  onPaymentSuccess={handleSuccess}
  onPaymentError={handleError}
/>
```

### 2. API Endpoints

#### Crear Payment Intent
```javascript
// POST /api/payments/create-intent
const response = await fetch('/api/payments/create-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 50.00,
    currency: 'usd',
    metadata: { order_id: '123' }
  })
});
```

#### Confirmar pago
```javascript
// POST /api/payments/confirm
const response = await fetch('/api/payments/confirm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    payment_intent_id: 'pi_xxxxx'
  })
});
```

### 3. Store de reserva

```javascript
import { 
  reservaStore, 
  confirmarPago, 
  fallarPago,
  resetearPago 
} from '$lib/stores/reservaStore.js';

// Confirmar pago exitoso
confirmarPago(paymentIntent);

// Manejar fallo de pago
fallarPago(error);

// Resetear estado de pago
resetearPago();
```

## 🧪 Pruebas

### Tarjetas de prueba de Stripe

Para probar la integración, usa estas tarjetas de prueba:

- **Éxito:** `4242 4242 4242 4242`
- **Fallo:** `4000 0000 0000 0002`
- **Requiere autenticación:** `4000 0025 0000 3155`

**CVV:** Cualquier número de 3 dígitos  
**Fecha:** Cualquier fecha futura  
**Código postal:** Cualquier código válido

## 🔒 Seguridad

- ✅ Las claves secretas nunca se exponen al frontend
- ✅ Validación de webhooks con signature de Stripe
- ✅ Encriptación SSL/TLS en todas las comunicaciones
- ✅ Validación de datos en servidor

## 🌐 Producción

Para usar en producción:

1. **Cambiar a claves de producción** en lugar de `test`
2. **Configurar dominio real** en webhooks
3. **Implementar logging** para transacciones
4. **Configurar monitoreo** de pagos
5. **Backup de datos** de transacciones

## 📞 Soporte

Para dudas sobre la integración:
- [Documentación de Stripe](https://stripe.com/docs)
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [SvelteKit](https://kit.svelte.dev/)

---

**Nota:** Esta implementación está lista para uso en desarrollo. Para producción, asegúrate de seguir las mejores prácticas de seguridad y compliance.