export type Dish = {
  id: string;
  name: string;
  description: string | null;
  menu_date: string; // YYYY-MM-DD
  is_active: boolean;
  created_at: string;
};

export type DishInsert = {
  name: string;
  description?: string | null;
  menu_date: string;
  is_active?: boolean;
};
