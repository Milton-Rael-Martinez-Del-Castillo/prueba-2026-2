import OfficeMenu from "./components/OfficeMenu";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
          Oficina
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          Almuerzo del día
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
          Elige una fecha, selecciona un plato y confirma con tu nombre y email. Si ya pediste ese día, verás tu elección y no podrás pedir de nuevo.
        </p>
      </div>

      <OfficeMenu />
    </main>
  );
}
