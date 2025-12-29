import gifts from '../../data/gifts.json'
import ProdutoClient from './produto-client'

export function generateStaticParams() {
  return (gifts as any[]).map(g => ({ id: String(g.id) }))
}

// Next.js 15 tipa `params`/`searchParams` como Promises nos arquivos de rota do App Router.
export default async function PresentePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ t?: string }>
}) {
  const { id } = await params
  const sp = (await searchParams) || {}
  const gift = (gifts as any[]).find(g => String(g.id) === String(id))
  const t = sp.t || ''
  if (!gift) {
    return (
      <main className="min-h-screen bg-background-light">
        <div className="mx-auto max-w-md px-4 pt-10">
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <div className="text-sm font-semibold text-rose-700">Presente não encontrado.</div>
          </div>
        </div>
      </main>
    )
  }
  return <ProdutoClient gift={gift as any} t={t} />
}
