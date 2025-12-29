'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import gifts from '../data/gifts.json'
import TopBar from '../components/TopBar'
import Toast from '../components/Toast'
import InputField from '../components/InputField'
import { formatBRL } from '../lib/format'
import { readFavorites, writeFavorites } from '../lib/favorites'

type CoupleData = {
  coupleName: string
  weddingDate: string
  description: string
  imageUrl: string
  pixType?: string
  pixKey?: string
}

const FALLBACK_AVATAR =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%25" height="100%25" fill="%23f1f5f9"/><text x="50%25" y="52%25" dominant-baseline="middle" text-anchor="middle" fill="%2364758b" font-family="Arial" font-size="18">Foto</text></svg>'

const FALLBACK_GIFT =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%25" height="100%25" fill="%23f8fafc"/><text x="50%25" y="52%25" dominant-baseline="middle" text-anchor="middle" fill="%2364758b" font-family="Arial" font-size="22">Presente</text></svg>'

export default function CasalClient() {
  const sp = useSearchParams()
  const t = sp.get('t') || ''
  const tab = sp.get('tab') || 'list'

  const [couple, setCouple] = useState<CoupleData | null>(null)
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const [q, setQ] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const [favorites, setFavorites] = useState<string[]>(() => readFavorites())

  useEffect(() => writeFavorites(favorites), [favorites])

  useEffect(() => {
    const run = async () => {
      if (!t) {
        setErr('Link inválido.')
        setLoading(false)
        return
      }
      setLoading(true)
      setErr('')
      try {
        const res = await fetch(`/api/list/resolve?t=${encodeURIComponent(t)}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Não foi possível carregar a lista.')
        setCouple(data.list.data)
        setPaid(Boolean(data.list.paid))
      } catch (e: any) {
        setErr(e.message || 'Erro ao carregar')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [t])

  const baseUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return window.location.origin
  }, [])

  const shareUrl = useMemo(() => {
    if (!t) return ''
    const url = new URL('/c', baseUrl || 'https://example.com')
    url.searchParams.set('t', t)
    return url.toString()
  }, [t, baseUrl])

  const filtered = useMemo(() => {
    const list = (gifts as any[]).slice()
    const qq = q.trim().toLowerCase()
    const byText = (g: any) => `${g.title} ${g.category}`.toLowerCase().includes(qq)

    const normal = qq ? list.filter(byText) : list
    const onlyFavs = normal.filter(g => favorites.includes(String(g.id)))
    return { normal, onlyFavs }
  }, [q, favorites])

  const toggleFav = (id: string) => {
    setFavorites(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
    setToast(prev => prev ? null : 'Favoritos atualizados ✅')
    setTimeout(() => setToast(null), 1400)
  }

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setToast('Link copiado ✅')
      setTimeout(() => setToast(null), 1400)
    } catch {
      setToast('Não consegui copiar 😅')
      setTimeout(() => setToast(null), 1400)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 pt-10">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <div className="text-sm text-slate-600">Carregando…</div>
        </div>
      </div>
    )
  }

  if (err || !couple) {
    return (
      <div className="mx-auto max-w-md px-4 pt-10">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <div className="text-sm font-semibold text-rose-700">{err || 'Link inválido.'}</div>
          <div className="mt-4">
            <Link href="/criar" className="text-sm font-semibold text-primary">
              Criar uma lista
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const listToShow = tab === 'favs' ? filtered.onlyFavs : filtered.normal

  return (
    <main className="min-h-screen bg-background-light">
      <TopBar
        title="Lista"
        right={
          <button
            onClick={() => copy(shareUrl)}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
          >
            Compartilhar
            <span className="material-symbols-outlined text-base">share</span>
          </button>
        }
      />

      <div className="mx-auto max-w-md px-4 pb-28 pt-6">
        {/* header */}
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={couple.imageUrl || FALLBACK_AVATAR}
                alt="Foto do casal"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="min-w-0">
              <div className="truncate text-base font-extrabold text-slate-900">{couple.coupleName}</div>
              <div className="mt-0.5 text-xs font-semibold text-slate-500">{couple.weddingDate}</div>
              <div className="mt-2 line-clamp-2 text-sm text-slate-600">{couple.description}</div>
            </div>
          </div>

          {!paid ? (
            <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
              Pix ainda não ativado. No Perfil, clique em <b>Ativar Pix</b>.
            </div>
          ) : null}
        </div>

        {/* search */}
        <div className="mt-4 rounded-3xl bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold">{tab === 'favs' ? 'Favoritos' : 'Presentes'}</h2>
            <div className="text-xs font-semibold text-slate-500">{listToShow.length} itens</div>
          </div>

          <div className="mt-3">
            <InputField label="" placeholder="Buscar presente..." value={q} onChange={setQ} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {listToShow.map((g: any) => {
              const id = String(g.id)
              const isFav = favorites.includes(id)
              return (
                <div key={id} className="rounded-3xl bg-white p-2 shadow-card">
                  <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
                    <img
                      src={g.image || FALLBACK_GIFT}
                      alt={g.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />

                    <button
                      onClick={() => toggleFav(id)}
                      className={
                        "absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full shadow-sm " +
                        (isFav ? "bg-rose-500 text-white" : "bg-white/90 text-slate-700")
                      }
                      aria-label="Favoritar"
                      title="Favoritar"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[22px]">{isFav ? 'favorite' : 'favorite_border'}</span>
                    </button>
                  </div>

                  <div className="px-1 pb-2 pt-3">
                    <div className="line-clamp-2 text-base font-extrabold leading-tight text-slate-900">{g.title}</div>
                    <div className="mt-1 text-2xl font-extrabold text-slate-900">{formatBRL(Number(g.price || 0))}</div>

                    <Link
                      href={`/presente/${id}?t=${encodeURIComponent(t)}`}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                    >
                      <span className="material-symbols-outlined">payments</span>
                      Presentear via Pix
                    </Link>
                  </div>
                </div>
              )
            })}

            {listToShow.length === 0 ? (
              <div className="col-span-2 rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                Nenhum presente encontrado.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
          <Link
            href={`/c?t=${encodeURIComponent(t)}`}
            className={"flex flex-col items-center gap-1 text-xs font-semibold " + (tab !== 'favs' ? 'text-slate-900' : 'text-slate-400')}
          >
            <span className="material-symbols-outlined">redeem</span>
            Presentes
          </Link>

          <Link
            href={`/c?t=${encodeURIComponent(t)}&tab=favs`}
            className={"flex flex-col items-center gap-1 text-xs font-semibold " + (tab === 'favs' ? 'text-slate-900' : 'text-slate-400')}
          >
            <span className="material-symbols-outlined">favorite</span>
            Favoritos
          </Link>

          <Link
            href={`/perfil?t=${encodeURIComponent(t)}`}
            className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-400"
          >
            <span className="material-symbols-outlined">person</span>
            Perfil
          </Link>
        </div>
      </div>

      <Toast show={!!toast} text={toast ?? ''} />
    </main>
  )
}
