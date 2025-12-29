'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'
import { formatBRL } from '../../lib/format'
import { readFavorites, writeFavorites } from '../../lib/favorites'

type Gift = {
  id: string | number
  title: string
  price: number
  description?: string
  category?: string
  image?: string
}

const FALLBACK_GIFT =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%25" height="100%25" fill="%23f1f5f9"/><text x="50%25" y="52%25" dominant-baseline="middle" text-anchor="middle" fill="%2364758b" font-family="Arial" font-size="22">Presente</text></svg>'

type CoupleData = {
  coupleName: string
  weddingDate: string
  description: string
  imageUrl: string
  pixType?: string
  pixKey?: string
}

export default function ProdutoClient({ gift, t }: { gift: Gift; t: string }) {

  const [couple, setCouple] = useState<CoupleData | null>(null)
  const [paid, setPaid] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    setFavorites(readFavorites())
  }, [])

  const isFav = favorites.includes(String(gift.id))
  const toggleFav = () => {
    const id = String(gift.id)
    const set = new Set(favorites)
    set.has(id) ? set.delete(id) : set.add(id)
    const next = Array.from(set)
    setFavorites(next)
    writeFavorites(next)
  }
  const [err, setErr] = useState('')

  useEffect(() => {
    const run = async () => {
      if (!t) return
      try {
        const res = await fetch(`/api/list/resolve?t=${encodeURIComponent(t)}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Erro ao carregar lista')
        setCouple(data.list.data)
        setPaid(Boolean(data.list.paid))
      } catch (e: any) {
        setErr(e.message || 'Erro')
      }
    }
    run()
  }, [t])

  const back = useMemo(() => (t ? `/c?t=${encodeURIComponent(t)}` : '/'), [t])

  const copyPix = async () => {
    if (!couple?.pixKey) return
    try {
      await navigator.clipboard.writeText(couple.pixKey)
      setToast('Pix copiado ✅')
      setTimeout(() => setToast(null), 1400)
    } catch {
      setToast('Não consegui copiar 😅')
      setTimeout(() => setToast(null), 1400)
    }
  }

  return (
    <main className="min-h-screen bg-background-light">
      <TopBar title="Presente" backHref={back} />

      <div className="mx-auto max-w-md px-4 pb-24 pt-6">
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
            <img
              src={gift.image || FALLBACK_GIFT}
              alt={gift.title}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={toggleFav}
              aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              className={
                'absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full shadow-sm ' +
                (isFav ? 'bg-rose-600 text-white' : 'bg-white/90 text-slate-600')
              }
            >
              <span className="material-symbols-outlined text-2xl">favorite</span>
            </button>
          </div>

          <div className="text-sm font-extrabold text-slate-900">{gift.title}</div>
          <div className="mt-1 text-xs font-semibold text-slate-500">{formatBRL(Number(gift.price || 0))}</div>

          {gift.description ? <div className="mt-3 text-sm text-slate-600">{gift.description}</div> : null}
          {gift.category ? <div className="mt-3 text-xs font-semibold text-slate-500">{gift.category}</div> : null}

          <div className="mt-6 rounded-2xl border border-slate-100 p-4">
            <div className="text-xs font-bold text-slate-700">Presentear via Pix</div>

            {!paid ? (
              <div className="mt-2 text-sm text-amber-800">
                Pix não ativado. O casal precisa ativar no Perfil.
              </div>
            ) : couple?.pixKey ? (
              <>
                <div className="mt-2 text-sm font-semibold text-slate-900">{couple.pixType}</div>
                <div className="mt-1 break-all text-sm text-slate-700">{couple.pixKey}</div>

                <button
                  onClick={copyPix}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white"
                >
                  Copiar Pix
                  <span className="material-symbols-outlined text-base">content_copy</span>
                </button>
              </>
            ) : (
              <div className="mt-2 text-sm text-slate-600">
                Não consegui carregar o Pix. {err ? <span className="text-rose-700">{err}</span> : null}
              </div>
            )}

            <div className="mt-3 text-xs text-slate-500">
              Dica: após pagar, você pode mandar o comprovante pro casal no WhatsApp.
            </div>
          </div>

          {couple?.coupleName ? (
            <div className="mt-5 text-center text-xs text-slate-500">
              Lista de <span className="font-semibold">{couple.coupleName}</span>
            </div>
          ) : null}

          <div className="mt-4">
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

      {toast ? <Toast>{toast}</Toast> : null}
    </main>
  )
}
