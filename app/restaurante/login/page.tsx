"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RestauranteLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/restaurante/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        setStatus("error");
        setMessage(result.error || "Credenciales inválidas.");
        return;
      }

      router.push("/restaurante");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("No se pudo conectar con el servidor.");
    }
  };

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-20">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">Panel restaurante</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">Iniciar sesión</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Ingresa el usuario y contraseña del restaurante para administrar el menú.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-zinc-700">
            Usuario
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-3 w-full rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-3 w-full rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500"
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            Iniciar sesión
          </button>
          {message ? <p className="text-sm text-red-600">{message}</p> : null}
        </form>
      </div>
    </main>
  );
}
