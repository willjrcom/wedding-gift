import Link from 'next/link'

export default function Page({ searchParams }: { searchParams: any }) {
  const t = String(searchParams?.t || '')
  const back = t ? `/perfil?t=${encodeURIComponent(t)}` : '/'

  return (
    <main className="min-h-screen bg-background-light">
      <div className="mx-auto max-w-md px-4 pt-14">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <div className="text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600">
              <span className="material-symbols-outlined">hourglass</span>
            </div>
            <h1 className="text-xl font-extrabold">Pagamento pendente</h1>
            <p className="mt-2 text-sm text-slate-600">Assim que o pagamento aprovar, o Pix será liberado automaticamente.</p>
          </div>

          <div className="mt-6">
            <Link
              href={back}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Voltar
              <span className="material-symbols-outlined text-base">arrow_back</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
