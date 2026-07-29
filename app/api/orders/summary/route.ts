import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { isRestauranteAuthenticated } from "../../../../lib/restaurante-auth";

export async function GET(request: Request) {
  if (!(await isRestauranteAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const menu_date = url.searchParams.get("menu_date");

  if (!menu_date) {
    return NextResponse.json(
      { error: "menu_date es obligatorio para el resumen." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("dish_id, dishes(id, name, description)")
    .eq("order_date", menu_date);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const counts = new Map<string, { dish_id: string; name: string; description: string | null; count: number }>();

  (data ?? []).forEach((item: any) => {
    const dish_id = item.dish_id as string;
    const dish = item.dishes;
    const name = dish?.name ?? "Plato eliminado";
    const description = dish?.description ?? null;

    if (!counts.has(dish_id)) {
      counts.set(dish_id, { dish_id, name, description, count: 0 });
    }

    const entry = counts.get(dish_id)!;
    entry.count += 1;
  });

  const result = Array.from(counts.values()).sort((a, b) => b.count - a.count);

  return NextResponse.json(result);
}
