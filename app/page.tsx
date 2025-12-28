
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div className="mx-auto max-w-md w-full px-6 pt-16 pb-10">
        <div className="rounded-3xl bg-white shadow-soft border border-gray-100 p-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <span className="material-symbols-filled text-primary">favorite</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Lista de presentes via Pix</h1>
          <p className="text-slate-600 mt-2">
            Crie sua lista sem taxas e compartilhe um link com seus convidados.
          </p>
          <Link
            href="/criar"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-white font-semibold shadow-soft active:scale-[0.99] transition"
          >
            Criar lista <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-md w-full px-6 pb-8 text-center text-xs text-slate-500">
        Sem checkout. Sem taxas. Só Pix.
      </div>
    </main>
  )
}
