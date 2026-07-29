<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Prueba técnica — reglas para el agente

## Producto

App **Almuerzo del día**:

- `/` — oficina: menú por fecha, un pedido por email+fecha, mostrar elección si ya pidió.
- `/restaurante` — restaurante: login con password de env, CRUD de platos por fecha, historial de fechas, conteo de pedidos.

## Stack

- Next.js App Router (este repo), React, TypeScript, Tailwind CSS v4.
- Supabase vía `@supabase/supabase-js` y `@supabase/ssr` (clients en `lib/supabase/`).
- Schema fijo en `supabase/schema.sql`. **No inventes tablas ni columnas.**

## Prohibido

- Supabase Auth, OAuth, magic links, Auth.js, tabla de users/roles.
- Service role key en el cliente o en el repo.
- Librerías de calendario pesadas (usa `<input type="date">`).
- Features fuera del README (pagos, stock, cancelar pedido, deploy, e2e).

## Auth del restaurante

- Usuario fijo: `restaurante`.
- Password: `process.env.RESTAURANT_PASSWORD`.
- Sesión: cookie (httpOnly preferible). Completar `lib/restaurante-auth.ts`.
- Proteger `/restaurante` en layout/middleware/server checks.

## Datos

- `dishes`: `name`, `description`, `menu_date`, `is_active`.
- `orders`: `dish_id`, `person_name`, `person_email`, `order_date`.
- Constraint: `UNIQUE (person_email, order_date)` — manejar error de duplicado en UI.
- Filtrar menú oficina: `menu_date` + `is_active = true`.

## Preferencias de implementación

- Preferir Server Components; Client Components solo para interactividad (forms, date inputs, estado local).
- Reutilizar tipos en `types/`.
- Mensajes claros en vacío / error.
- No commitear `.env.local`.

## Forma de trabajar

1. Una tarea pequeña a la vez.
2. Verificar en el navegador después de cada flujo.
3. Si una API de Next o Supabase no coincide con tu entrenamiento, lee docs locales/oficiales; no inventes.
