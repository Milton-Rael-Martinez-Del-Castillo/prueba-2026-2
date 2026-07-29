import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { isRestauranteAuthenticated } from "../../../lib/restaurante-auth";
import type { Dish } from "../../../types/dish";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const menu_date = url.searchParams.get("menu_date");
  const history = url.searchParams.get("history") === "true";
  const includeInactive = url.searchParams.get("include_inactive") === "true";

  const supabase = await createClient();

  if (history) {
    if (!(await isRestauranteAuthenticated())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("dishes")
      .select("menu_date")
      .order("menu_date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const dates = Array.from(
      new Set(
        (data ?? [])
          .map((item) => item.menu_date)
          .filter((value): value is string => Boolean(value)),
      ),
    );

    return NextResponse.json(dates);
  }

  if (!menu_date) {
    return NextResponse.json(
      { error: "menu_date es obligatorio para obtener platos." },
      { status: 400 },
    );
  }

  if (includeInactive && !(await isRestauranteAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let query = supabase.from("dishes").select("*").eq("menu_date", menu_date).order("created_at", { ascending: true });

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  if (!(await isRestauranteAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : null;
  const menu_date = typeof body.menu_date === "string" ? body.menu_date : "";

  if (!name || !menu_date) {
    return NextResponse.json(
      { error: "Nombre y fecha son obligatorios para crear un plato." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dishes")
    .insert([
      {
        name,
        description: description || null,
        menu_date,
        is_active: true,
      },
    ])
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
