import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import type { OrderWithDish, OrderInsert } from "../../../types/order";

const normalizeEmail = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const order_date = url.searchParams.get("order_date");
  const person_email = normalizeEmail(url.searchParams.get("person_email"));

  if (!order_date || !person_email) {
    return NextResponse.json(
      { error: "Faltan order_date y person_email en la consulta." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, dishes(id, name, description)")
    .eq("order_date", order_date)
    .eq("person_email", person_email)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const person_email = normalizeEmail(body.person_email);
  const person_name = typeof body.person_name === "string" ? body.person_name.trim() : "";
  const order_date = typeof body.order_date === "string" ? body.order_date : "";
  const dish_id = typeof body.dish_id === "string" ? body.dish_id : "";

  if (!person_email || !person_name || !order_date || !dish_id) {
    return NextResponse.json(
      { error: "Todos los campos son obligatorios para crear el pedido." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        person_email,
        person_name,
        order_date,
        dish_id,
      },
    ])
    .select("*, dishes(id, name, description)")
    .maybeSingle();

  if (error) {
    const isDuplicate =
      error.code === "23505" ||
      (typeof error.message === "string" && error.message.toLowerCase().includes("duplicate"));

    return NextResponse.json(
      {
        error: isDuplicate
          ? "Ya existe un pedido para ese email y fecha. No se puede pedir dos veces."
          : error.message,
      },
      { status: isDuplicate ? 409 : 500 },
    );
  }

  return NextResponse.json(data);
}
