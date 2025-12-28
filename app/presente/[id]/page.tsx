
import { Suspense } from 'react'
import gifts from '../../data/gifts.json'
import ProdutoClient from './produto-client'

export function generateStaticParams() {
  return gifts.map((gift: any) => ({ id: gift.id }))
}

export default function Page({ params }: { params: { id: string } }) {
  const gift = gifts.find((g: any) => g.id === params.id)
  if (!gift) return null

  return (
    <Suspense
      fallback={
        <main className="min-h-screen">
          <div className="mx-auto max-w-md px-4 pt-20 text-center text-slate-600">
            Carregando...
          </div>
        </main>
      }
    >
      <ProdutoClient gift={gift} />
    </Suspense>
  )
}
