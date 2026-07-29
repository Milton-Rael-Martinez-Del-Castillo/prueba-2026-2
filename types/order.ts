export type Order = {
  id: string;
  dish_id: string;
  person_name: string;
  person_email: string;
  order_date: string; // YYYY-MM-DD
  created_at: string;
};

export type OrderInsert = {
  dish_id: string;
  person_name: string;
  person_email: string;
  order_date: string;
};

/** Pedido con el plato anidado (útil para mostrar "tu elección"). */
export type OrderWithDish = Order & {
  dishes: Pick<import("./dish").Dish, "id" | "name" | "description"> | null;
};
