
import gifts from '../../data/gifts.json'
import ProdutoClient from './produto-client'

export function generateStaticParams() {
  return gifts.map((gift: any) => ({ id: gift.id }))
}

export default function Page({ params }: { params: { id: string } }) {
  const gift = gifts.find((g: any) => g.id === params.id)
  if (!gift) return null
  return <ProdutoClient gift={gift} />
}
