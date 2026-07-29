"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dish } from "../../types/dish";
import type { OrderWithDish } from "../../types/order";

const formatDateInputValue = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
};

const today = new Date().toISOString().slice(0, 10);

export default function OfficeMenu() {
  const [selectedDate, setSelectedDate] = useState(today);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [order, setOrder] = useState<OrderWithDish | null>(null);
  const [selectedDishId, setSelectedDishId] = useState<string>("");
  const [personName, setPersonName] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const savedEmail = window.localStorage.getItem("almuerzo_person_email");
    const savedName = window.localStorage.getItem("almuerzo_person_name");
    if (savedEmail) setPersonEmail(savedEmail);
    if (savedName) setPersonName(savedName);
  }, []);

  useEffect(() => {
    setStatus("loading");
    setMessage("");

    const fetchData = async () => {
      try {
        const dishesRes = await fetch(`/api/dishes?menu_date=${selectedDate}`);
        if (!dishesRes.ok) {
          throw new Error("No se pudo cargar el menú.");
        }
        const dishesData = (await dishesRes.json()) as Dish[];
        setDishes(dishesData);

        if (personEmail) {
          const orderRes = await fetch(
            `/api/orders?order_date=${selectedDate}&person_email=${encodeURIComponent(personEmail)}`,
          );

          if (orderRes.ok) {
            const orderData = (await orderRes.json()) as OrderWithDish;
            setOrder(orderData);
            setSelectedDishId(orderData.dish_id);
          } else {
            setOrder(null);
            setSelectedDishId("");
          }
        } else {
          setOrder(null);
          setSelectedDishId("");
        }

        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage("No se pudo cargar el menú. Intenta de nuevo más tarde.");
      }
    };

    fetchData();
  }, [selectedDate, personEmail]);

  const canSubmit = useMemo(() => {
    return (
      selectedDishId &&
      personName.trim().length > 0 &&
      personEmail.trim().length > 0 &&
      order === null
    );
  }, [selectedDishId, personName, personEmail, order]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dish_id: selectedDishId,
          person_name: personName,
          person_email: personEmail,
          order_date: selectedDate,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setStatus("error");
        setMessage(result.error || "No se pudo crear el pedido.");
        return;
      }

      setOrder(result);
      window.localStorage.setItem("almuerzo_person_email", personEmail);
      window.localStorage.setItem("almuerzo_person_name", personName);
      setMessage("Pedido registrado correctamente.");
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("No se pudo conectar con el servidor.");
    }
  };

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
                Fecha del pedido
              </p>
              <p className="text-2xl font-semibold text-zinc-900">{selectedDate}</p>
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
              <span className="text-sm text-zinc-600">Seleccionar fecha</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900"
              />
            </label>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
            <p className="text-base font-semibold text-zinc-900">Menú disponible</p>
            {status === "loading" ? (
              <p className="mt-4 text-sm text-zinc-600">Cargando platos...</p>
            ) : status === "error" ? (
              <p className="mt-4 text-sm text-red-600">{message}</p>
            ) : dishes.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-600">No hay platos activos para esa fecha.</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {dishes.map((dish) => (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => setSelectedDishId(dish.id)}
                    className={`rounded-3xl border p-4 text-left transition hover:border-zinc-400 ${
                      selectedDishId === dish.id ? "border-emerald-500 bg-emerald-50" : "border-zinc-200 bg-white"
                    }`}
                  >
                    <p className="font-semibold text-zinc-900">{dish.name}</p>
                    {dish.description ? (
                      <p className="mt-1 text-sm text-zinc-600">{dish.description}</p>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
            <p className="text-base font-semibold text-zinc-900">Tu información</p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-zinc-700">
                Nombre
                <input
                  value={personName}
                  onChange={(event) => setPersonName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="block text-sm font-medium text-zinc-700">
                Email
                <input
                  type="email"
                  value={personEmail}
                  onChange={(event) => setPersonEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500"
                />
              </label>
              <button
                type="submit"
                disabled={!canSubmit || status === "loading"}
                className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {order ? "Ya tienes un pedido" : "Confirmar pedido"}
              </button>
            </form>
            {message ? (
              <p className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-emerald-700"}`}>
                {message}
              </p>
            ) : null}
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-base font-semibold text-zinc-900">Estado de tu pedido</p>
            {personEmail ? (
              order ? (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-zinc-600">Ya realizaste un pedido para esta fecha con {personEmail}.</p>
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="font-semibold text-zinc-900">{order.dishes?.name ?? "Plato eliminado"}</p>
                    {order.dishes?.description ? (
                      <p className="mt-1 text-sm text-zinc-600">{order.dishes.description}</p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-zinc-600">
                  Aún no hay un pedido registrado para este email en la fecha seleccionada.
                </p>
              )
            ) : (
              <p className="mt-4 text-sm text-zinc-600">
                Ingresa tu email para revisar si ya hiciste un pedido este día.
              </p>
            )}
            <p className="mt-6 text-xs text-zinc-500">
              Tu email se guarda solo en tu navegador para recordar tu pedido en esta pantalla.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
