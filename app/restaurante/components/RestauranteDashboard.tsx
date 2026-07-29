"use client";

import { useEffect, useMemo, useState } from "react";

type Dish = {
  id: string;
  name: string;
  description: string | null;
  menu_date: string;
  is_active: boolean;
};

type SummaryItem = {
  dish_id: string;
  name: string;
  description: string | null;
  count: number;
};

const today = new Date().toISOString().slice(0, 10);

export default function RestauranteDashboard() {
  const [selectedDate, setSelectedDate] = useState(today);
  const [history, setHistory] = useState<string[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState<string>("");

  const loadHistory = async () => {
    try {
      const response = await fetch("/api/dishes?history=true");
      const data = await response.json();
      if (response.ok) {
        setHistory(data ?? []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadDishes = async (date: string) => {
    try {
      const response = await fetch(`/api/dishes?menu_date=${date}&include_inactive=true`);
      const data = await response.json();
      if (response.ok) {
        setDishes(data ?? []);
      } else {
        setMessage(data.error || "Error al cargar los platos.");
      }
    } catch (error) {
      console.error(error);
      setMessage("No se pudo cargar los platos.");
    }
  };

  const loadSummary = async (date: string) => {
    try {
      const response = await fetch(`/api/orders/summary?menu_date=${date}`);
      const data = await response.json();
      if (response.ok) {
        setSummary(data ?? []);
      } else {
        setMessage(data.error || "Error al cargar el resumen.");
      }
    } catch (error) {
      console.error(error);
      setMessage("No se pudo cargar el resumen.");
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    setMessage("");
    loadDishes(selectedDate);
    loadSummary(selectedDate);
  }, [selectedDate]);

  const hasMenu = dishes.length > 0;
  const selectedHistory = history.includes(selectedDate);

  const handleAddDish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!name.trim()) {
      setStatus("error");
      setMessage("El nombre del plato es obligatorio.");
      return;
    }

    try {
      const response = await fetch("/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), menu_date: selectedDate }),
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "No se pudo crear el plato.");
        return;
      }

      setName("");
      setDescription("");
      setStatus("success");
      setMessage("Plato agregado correctamente.");
      loadDishes(selectedDate);
      loadHistory();
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("No se pudo conectar con el servidor.");
    }
  };

  const updateDish = async (dishId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/dishes/${dishId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: isActive }),
      });
      if (response.ok) {
        loadDishes(selectedDate);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDish = async (dishId: string) => {
    try {
      const response = await fetch(`/api/dishes/${dishId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        loadDishes(selectedDate);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/restaurante/logout", { method: "POST" });
    window.location.href = "/restaurante/login";
  };

  const sortedHistory = useMemo(
    () => [...history].sort((a, b) => Number(new Date(b)) - Number(new Date(a))),
    [history],
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">Restaurante</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">Gestionar menú</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              Crea platos para una fecha, desactiva o elimina entradas y revisa el resumen de pedidos por plato.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-3xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-900">Fecha de menú</p>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="mt-4 w-full rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500"
            />
            <p className="mt-4 text-sm text-zinc-600">
              {selectedHistory
                ? "Este día ya tiene menú en el historial."
                : "No hay menú previo registrado para esta fecha."}
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900">Historial de fechas</p>
                <p className="mt-1 text-sm text-zinc-600">Selecciona una fecha con menú existente.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {sortedHistory.length === 0 ? (
                <p className="text-sm text-zinc-600">Aún no hay fechas en el historial.</p>
              ) : (
                sortedHistory.map((date) => (
                  <button
                    type="button"
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      selectedDate === date
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                    }`}
                  >
                    {date}
                  </button>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-900">Crear plato</p>
            <form onSubmit={handleAddDish} className="mt-5 space-y-4">
              <label className="block text-sm font-medium text-zinc-700">
                Nombre del plato
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="block text-sm font-medium text-zinc-700">
                Descripción (opcional)
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  className="mt-3 w-full rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Agregar plato
              </button>
              {message ? (
                <p className={`text-sm ${status === "error" ? "text-red-600" : "text-emerald-700"}`}>{message}</p>
              ) : null}
            </form>
          </section>

          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-900">Resumen de pedidos</p>
            {summary.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-600">No hay pedidos para esta fecha.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {summary.map((item) => (
                  <div key={item.dish_id} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-zinc-900">{item.name}</p>
                        {item.description ? <p className="mt-1 text-sm text-zinc-600">{item.description}</p> : null}
                      </div>
                      <span className="rounded-full bg-zinc-900 px-3 py-1 text-sm font-semibold text-white">
                        {item.count} pedidos
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-900">Platos del menú</p>
            {dishes.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-600">No hay platos en este menú.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {dishes.map((dish) => (
                  <div key={dish.id} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-zinc-900">{dish.name}</p>
                        {dish.description ? <p className="mt-1 text-sm text-zinc-600">{dish.description}</p> : null}
                        <p className="mt-2 text-xs font-medium text-zinc-500">
                          {dish.is_active ? "Activo" : "Desactivado"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => updateDish(dish.id, !dish.is_active)}
                          className="rounded-3xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400"
                        >
                          {dish.is_active ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteDish(dish.id)}
                          className="rounded-3xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
