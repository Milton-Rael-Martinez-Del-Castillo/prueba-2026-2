# Prueba técnica 2026 — Almuerzo del día

Bienvenido/a. En esta prueba construirás una mini-app realista con el stack que usamos en la empresa: **Next.js**, **Supabase** y **Tailwind CSS**, usando **OpenCode** (plan gratuito) como agente de coding.

**Tiempo:** 3 horas  
**Entrega:** fork en GitHub + agregarnos como collaborator + `BITACORA.md`

---

## 1. Contexto del problema

En la oficina no hay una forma clara de pedir el almuerzo. Necesitamos que:

1. El **restaurante** pueda armar el menú de un día concreto (y consultar días anteriores).
2. La **oficina** pueda ver el menú de una fecha, elegir **un** plato y confirmar con sus datos.
3. Quien ya pidió ese día **no pueda cambiar** de plato, pero **siga viendo** su elección en la interfaz.

---

## 2. Stack y herramientas obligatorias

| Qué | Detalle |
|-----|---------|
| Framework | Next.js (App Router) — ya está en este repo |
| Estilos | Tailwind CSS (ya configurado) |
| Backend/datos | Supabase (proyecto free tuyo) |
| Agente IA | **OpenCode** en plan gratuito (modelos Zen free u otros free conectados a OpenCode) |
| Lenguaje | TypeScript |

### Reglas de IA

- Debes usar **OpenCode** para resolver la prueba (planificar, implementar, depurar).
- Está permitido ampliar `AGENTS.md` con instrucciones para tu agente.
- **Prohibido** copiar la solución de otro candidato.
- **Prohibido** subir secretos (`.env.local`, service role key) al repositorio.
- No se evalúa “usar poca IA”: se evalúa **cómo diriges al agente**, verificas y entregas algo que funciona.

---

## 3. Setup inicial (haz esto primero)

### 3.1 Fork y clone

1. Haz **fork** de este repositorio a tu cuenta de GitHub.
2. Clona **tu fork** en local.
3. En GitHub → tu fork → **Settings → Collaborators** → invita al evaluador (te indicarán el usuario/email en el briefing).
4. Instala dependencias:

```bash
npm install
```

### 3.2 Proyecto Supabase

1. Crea un proyecto en [https://supabase.com](https://supabase.com) (plan free).
2. Abre **SQL Editor**, pega y ejecuta todo el contenido de [`supabase/schema.sql`](supabase/schema.sql).
3. En **Settings → API**, copia:
   - Project URL
   - `anon` `public` key  
   **No uses** la `service_role` key en esta prueba.

### 3.3 Variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
RESTAURANT_PASSWORD=una-clave-que-tu-elijas
```

- Usuario del panel restaurante (fijo): **`restaurante`**
- Password: el valor de `RESTAURANT_PASSWORD`

### 3.4 Arrancar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## 4. Qué debes construir (must-have)

El repo trae **scaffold** (clientes Supabase, tipos, schema, helpers de auth con `TODO`). **Tú implementas** las pantallas y la lógica. No hace falta deploy.

### 4.1 Vista Oficina — `/` (pública, sin password)

1. Selector de **fecha** (`<input type="date">` está bien; no uses librerías de calendario).
2. Listar platos con `is_active = true` y `menu_date = fecha elegida`.
3. Si la persona **aún no tiene pedido** ese día:
   - Elegir un plato.
   - Confirmar con **nombre** + **email**.
   - Guardar en `orders` (`order_date` = fecha elegida, `dish_id` = plato).
4. Si **ya pidió** ese día (mismo email):
   - **No** permitir otro pedido.
   - Mostrar claramente el plato que eligió.
5. Cómo “recordar” a la persona en la UI: cookie o `localStorage` con el email (o nombre+email) tras el primer pedido. La **fuente de verdad** es Supabase + el constraint `UNIQUE (person_email, order_date)`.

### 4.2 Vista Restaurante — `/restaurante` (protegida)

1. **Login** con usuario `restaurante` + `RESTAURANT_PASSWORD`.
2. Sin sesión válida → no se administra el menú (redirect a login o pantalla de login).
3. Con sesión:
   - Elegir una **fecha** de menú.
   - **Crear** platos para esa fecha (nombre; descripción opcional).
   - **Listar** platos de esa fecha; poder **desactivar** o eliminar para que no salgan en oficina.
   - **Historial:** ver fechas que ya tienen menú y abrir una para gestionarla.
4. **Resumen (recomendado / cuenta en rúbrica):** para la fecha seleccionada, conteo de pedidos por plato.
5. Logout que borre la cookie de sesión.

### 4.3 Auth: cómo hacerlo (obligatorio este enfoque)

- **Prohibido** en esta prueba: Supabase Auth, OAuth, magic links, Auth.js, tabla `users` de roles.
- **Obligatorio:** gate simple con env + cookie.
- Parte de la guía está en [`lib/restaurante-auth.ts`](lib/restaurante-auth.ts) (completa los `TODO`).
- El “rol” se aplica en la **aplicación** (proteger `/restaurante`), no con RLS por usuario. El schema deja RLS demo abierto a propósito.

### 4.4 Modelo de datos (no lo inventes)

Respeta [`supabase/schema.sql`](supabase/schema.sql):

| Tabla | Uso |
|-------|-----|
| `dishes` | Platos por `menu_date`, flag `is_active` |
| `orders` | Pedido por persona; **único** por `(person_email, order_date)` |

Tipos TypeScript: [`types/dish.ts`](types/dish.ts), [`types/order.ts`](types/order.ts).  
Clientes: [`lib/supabase/client.ts`](lib/supabase/client.ts) (browser), [`lib/supabase/server.ts`](lib/supabase/server.ts) (server).

---

## 5. Fuera de alcance (no implementes esto)

- Supabase Auth / roles en base de datos / RLS por usuario.
- Cambiar o cancelar un pedido ya hecho.
- Pagos, precios, stock, notificaciones, WhatsApp.
- Multi-restaurante, deploy, tests e2e, CI.
- Drag-and-drop, PWA, diseño marketing elaborado.

Si el agente propone Auth completa u otras features, **corrígelo** y vuelve al checklist.

---

## 6. Criterios de aceptación (checklist)

Marca mentalmente antes de entregar:

- [ ] `npm run dev` funciona con tu `.env.local` y el schema aplicado.
- [ ] Sin password correcta no se administra `/restaurante`.
- [ ] Con login: crear platos para una fecha elegida.
- [ ] Historial básico de fechas con menú.
- [ ] Oficina: ver menú de una fecha y crear pedido (nombre + email).
- [ ] Mismo email + misma fecha: no crea segundo pedido; la UI muestra la elección.
- [ ] Cambiar la fecha en oficina muestra el menú (y pedido, si existe) de esa fecha.
- [ ] Errores o estados vacíos no dejan la pantalla “muda”.
- [ ] `BITACORA.md` completada.
- [ ] No hay `.env.local` ni service role en el repo.
- [ ] El evaluador está como collaborator en tu fork.

---

## 7. Cómo trabajar con OpenCode (recomendado)

1. Lee este README y `AGENTS.md` **antes** de pedir código al agente.
2. Descompón en tareas pequeñas, por ejemplo:
   - Completar sesión cookie del restaurante.
   - Listar platos por fecha (oficina).
   - Formulario de pedido + manejo del UNIQUE.
   - CRUD platos + historial de fechas.
   - Conteo de pedidos.
3. En cada tarea: “lee `schema.sql`, no inventes columnas”.
4. **Verifica** en el navegador el flujo completo:
   - login → menú día X → logout  
   - pedir con email A → recargar → ver bloqueo  
   - pedir de nuevo mismo email → error o UI bloqueada  
5. Si el modelo alucina APIs de Next/Supabase, apunta a `node_modules/next/dist/docs/` y a la docs oficiales.
6. Documenta en la bitácora qué falló y cómo lo corregiste.

Sugerencia de tiempo:

| Bloque | Minutos |
|--------|---------|
| Fork, Supabase, env, schema | 20–30 |
| Plan + `AGENTS.md` | 15–20 |
| Gate restaurante + CRUD menú por fecha | 45–55 |
| Oficina: menú + pedido único + mostrar elección | 45–55 |
| Conteo, pulido, bitácora, push | 25–35 |

---

## 8. Entrega

1. Push a **tu fork** (rama `main` o la que indiquen).
2. Asegura que el evaluador es **collaborator**.
3. Completa [`BITACORA.md`](BITACORA.md) (obligatorio).
4. Opcional: tag `entrega-final`.

No hace falta pull request hacia el repo plantilla.

---

## 9. Estructura del repo (referencia)

```
├── README.md                 ← este enunciado
├── AGENTS.md                 ← reglas para tu agente (puedes ampliarlas)
├── BITACORA.md               ← completa tú
├── .env.example
├── supabase/schema.sql
├── lib/supabase/             ← clients listos
├── lib/restaurante-auth.ts   ← completa los TODO
├── types/
└── app/                      ← implementa aquí las rutas y UI
```

Archivos solo del evaluador (rúbrica, etc.) **no** forman parte de tu entrega y no están en el repo público.

---

## 10. Evaluación (resumen para candidatos)

Se puntúa sobre 100, con énfasis en **uso del agente (40%)**, luego funcionalidad, calidad de stack y entrega.  
Detalle interno solo lo maneja el evaluador. Lo que sí debes cuidar:

- Bitácora honesta y concreta.
- App que cumple el checklist.
- Código alineado al schema y sin secretos.
- Fork accesible + collaborator.

¡Éxito — y que el almuerzo quede ordenado!
