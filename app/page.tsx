import Link from "next/link";

/**
 * Página inicial de la plantilla.
 * Sustituye / amplía esta vista con la experiencia de Oficina (menú + pedido).
 * Implementa también /restaurante según el README.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-6 px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
        Prueba técnica 2026
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Almuerzo del día
      </h1>
      <p className="text-lg leading-relaxed text-zinc-600">
        Plantilla lista: schema Supabase, clients y enunciado en el README. Tu
        tarea es implementar la vista de oficina aquí y el panel en{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          /restaurante
        </code>
        .
      </p>
      <ul className="list-disc space-y-2 pl-5 text-zinc-700">
        <li>Lee el README completo antes de codear.</li>
        <li>Ejecuta <code className="text-sm">supabase/schema.sql</code> en tu proyecto.</li>
        <li>Copia <code className="text-sm">.env.example</code> → <code className="text-sm">.env.local</code>.</li>
        <li>Usa OpenCode (plan free) y completa <code className="text-sm">BITACORA.md</code>.</li>
      </ul>
      <p className="text-sm text-zinc-500">
        Cuando implementes rutas, puedes enlazar el panel aquí:{" "}
        <Link href="/restaurante" className="underline underline-offset-2">
          /restaurante
        </Link>{" "}
        (aún no existe — créala tú).
      </p>
    </main>
  );
}
