/**
 * Gate simple del restaurante (NO es Supabase Auth).
 *
 * Requisitos de la prueba:
 * - Usuario fijo documentado en el README (ej. "restaurante").
 * - Password desde process.env.RESTAURANT_PASSWORD.
 * - Tras login correcto, marcar sesión con cookie (httpOnly recomendado).
 * - Proteger /restaurante: sin cookie válida → login o redirect.
 *
 * Implementa estas funciones (o un enfoque equivalente). No uses
 * @supabase/auth-helpers ni signInWithPassword para este gate.
 */

import { cookies } from "next/headers";

export const RESTAURANTE_USERNAME = "restaurante";
export const RESTAURANTE_SESSION_COOKIE = "restaurante_session";

/**
 * Compara credenciales con el usuario fijo y RESTAURANT_PASSWORD.
 * Debe ejecutarse en el servidor (Server Action / Route Handler).
 */
export function verifyRestauranteCredentials(
  username: string,
  password: string,
): boolean {
  const expected = process.env.RESTAURANT_PASSWORD;
  if (!expected) {
    throw new Error("Falta RESTAURANT_PASSWORD en .env.local");
  }
  return username === RESTAURANTE_USERNAME && password === expected;
}

/**
 * Crear cookie de sesión tras login OK.
 */
export async function createRestauranteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: RESTAURANTE_SESSION_COOKIE,
    value: "1",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });
}

/**
 * Borrar cookie de sesión (logout).
 */
export async function destroyRestauranteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(RESTAURANTE_SESSION_COOKIE);
}

/**
 * Leer cookie y devolver si hay sesión de restaurante.
 */
export async function isRestauranteAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(RESTAURANTE_SESSION_COOKIE);
  return cookie?.value === "1";
}
