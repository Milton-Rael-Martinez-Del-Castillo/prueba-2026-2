import { NextResponse } from "next/server";
import { destroyRestauranteSession } from "../../../../lib/restaurante-auth";

export async function POST() {
  await destroyRestauranteSession();
  return NextResponse.json({ success: true });
}
