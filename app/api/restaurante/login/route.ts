import { NextResponse } from "next/server";
import { createRestauranteSession, verifyRestauranteCredentials } from "../../../../lib/restaurante-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Usuario y contraseña son obligatorios." },
      { status: 400 },
    );
  }

  if (!verifyRestauranteCredentials(username, password)) {
    return NextResponse.json(
      { error: "Credenciales inválidas." },
      { status: 401 },
    );
  }

  await createRestauranteSession();
  return NextResponse.json({ success: true });
}
