-- ============================================================
-- Prueba técnica 2026 — Almuerzo del día
-- Ejecutar en el SQL Editor de tu proyecto Supabase (free).
-- ============================================================

-- Platos publicados por el restaurante para una fecha concreta
create table if not exists public.dishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  menu_date date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists dishes_menu_date_idx on public.dishes (menu_date);
create index if not exists dishes_menu_date_active_idx on public.dishes (menu_date, is_active);

-- Pedidos de la oficina: 1 por persona (email) y fecha
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  dish_id uuid not null references public.dishes (id) on delete restrict,
  person_name text not null,
  person_email text not null,
  order_date date not null,
  created_at timestamptz not null default now(),
  constraint orders_one_per_person_per_day unique (person_email, order_date)
);

create index if not exists orders_order_date_idx on public.orders (order_date);
create index if not exists orders_dish_id_idx on public.orders (dish_id);

-- RLS demo: abierto para la prueba (anon). En producción NO harías esto.
alter table public.dishes enable row level security;
alter table public.orders enable row level security;

drop policy if exists "demo_dishes_all" on public.dishes;
create policy "demo_dishes_all"
  on public.dishes
  for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "demo_orders_all" on public.orders;
create policy "demo_orders_all"
  on public.orders
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Seed: menú de hoy + un día anterior (para probar historial)
insert into public.dishes (name, description, menu_date, is_active)
values
  ('Pollo al horno', 'Con arroz y ensalada', current_date, true),
  ('Pasta primavera', 'Vegetariana', current_date, true),
  ('Sopa del día', 'Entrada / opción ligera', current_date, true),
  ('Hamburguesa casera', 'Menú de prueba (ayer)', current_date - 1, true),
  ('Ensalada César', 'Menú de prueba (ayer)', current_date - 1, true);
