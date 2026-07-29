import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { isRestauranteAuthenticated } from "../../../../lib/restaurante-auth";
import type { Dish } from "../../../../types/dish";

export async function PATCH(
  request: Request,
  context: { params: unknown },
) {
  if (!(await isRestauranteAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const params = (context as any).params;
  const { id } = params as { id: string };
  const body = await request.json();
  const updatePayload: Partial<Pick<Dish, "name" | "description" | "is_active">> = {};

  if (typeof body.name === "string") {
    updatePayload.name = body.name.trim();
  }

  if (typeof body.description === "string") {
    updatePayload.description = body.description.trim() || null;
  }

  if (typeof body.is_active === "boolean") {
    updatePayload.is_active = body.is_active;
  }

  if (!Object.keys(updatePayload).length) {
    return NextResponse.json(
      { error: "No se enviaron campos válidos para actualizar." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dishes")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Plato no encontrado." }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  context: { params: unknown },
) {
  if (!(await isRestauranteAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const params = (context as any).params;
  const { id } = params as { id: string };
  const supabase = await createClient();
  const { error } = await supabase.from("dishes").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
