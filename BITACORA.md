# Bitácora de la prueba

Completa esta bitácora **antes de entregar**. Sé concreto/a (nombres de modelos, errores reales, decisiones).

## Datos

- **Nombre:**
- **Fork (URL):**
- **Modelo(s) usados en OpenCode (plan free):** Zen free
- **Tiempo aproximado usado:** 2-3 horas

- Implementé la app de oficina `/` con selector de fecha, listado de platos activos y pedido con nombre/email.
- Implementé el panel protegido `/restaurante` con login por cookie, historial de fechas, CRUD de platos y resumen de pedidos.
- Solucioné un bug real: la app fallaba porque el env esperaba `NEXT_PUBLIC_SUPABASE_ANON_KEY` y el archivo tenía `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Verifiqué `npm run build` y el proyecto compila correctamente.

## . Si tuvieras 1 hora más

¿Qué mejorarías?

- Añadir tests básicos de integración y e2e para el flujo de pedido y autenticación.
- Mejorar la experiencia móvil y los estados de carga/error en el dashboard del restaurante.
- Añadir mensajes más ricos para errores de validación de email y campos vacíos.
