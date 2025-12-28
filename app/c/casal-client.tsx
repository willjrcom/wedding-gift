'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import gifts from '../data/gifts.json'
import TopBar from '../components/TopBar'
import Toast from '../components/Toast'
import { decode } from '../lib/encode'
import { formatBRL, formatDatePtBR } from '../lib/format'
import { useEffect, useMemo, useState } from 'react'
import { readFavorites, writeFavorites } from '../lib/favorites'

export default function CasalClient() {
  const sp = useSearchParams()
  const d = sp.get('d')
  const tab = sp.get('tab')

  const [toast, setToast] = useState('')
  const [query, setQuery] = useState('')
  const [onlyFavs, setOnlyFavs] = useState(false)
  const [favSet, setFavSet] = useState<Set<string>>(new Set())

  const data: any = useMemo(() => {
    if (!d) return null
    return decode(d)
  }, [d])

  useEffect(() => {
    setFavSet(new Set(readFavorites()))
  }, [])

  useEffect(() => {
    setOnlyFavs(tab === 'favs')
  }, [tab])

  if (!d || !data) return null

  function flash(msg: string) {
    setToast(msg)
    window.clearTimeout((flash as any)._t)
    ;(flash as any)._t = window.setTimeout(() => setToast(''), 1500)
  }

  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: data.coupleName || 'Lista de Presentes',
          text: 'Acesse nossa lista de presentes 💜',
          url
        })
        return
      }
      await navigator.clipboard.writeText(url)
      flash('Link copiado!')
    } catch {
      // ignore
    }
  }

  function persist(next: Set<string>) {
    setFavSet(next)
    writeFavorites(Array.from(next))
  }

  function toggleFav(id: string) {
    const next = new Set(favSet)
    if (next.has(id)) {
      next.delete(id)
      persist(next)
      flash('Removido dos favoritos')
      return
    }
    next.add(id)
    persist(next)
    flash('Adicionado aos favoritos')
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (gifts as any[]).filter((g) => {
      const matches = !q || String(g.title || '').toLowerCase().includes(q)
      const favOk = !onlyFavs || favSet.has(String(g.id))
      return matches && favOk
    })
  }, [query, onlyFavs, favSet])

  const isPresentesActive = !onlyFavs
  const isFavActive = onlyFavs

  return (
    <main className="min-h-screen">
      <TopBar
        title="Presentes"
        right={
          <button
            onClick={share}
            className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center active:scale-[0.98] transition"
            aria-label="Compartilhar"
          >
            <span className="material-symbols-outlined text-primary">share</span>
          </button>
        }
      />

      <Toast show={!!toast} text={toast} />

      <div className="mx-auto max-w-md px-4 pb-28">
        {/* Couple hero */}
        <div className="mt-4 rounded-3xl bg-white border border-gray-100 shadow-soft overflow-hidden">
          <div className="p-4">
            <div className="rounded-3xl overflow-hidden bg-gray-100">
              <img
                src={data.imageUrl || 'https://via.placeholder.com/1200x800?text=Foto+do+casal'}
                alt="Foto do casal"
                className="w-full h-56 object-cover"
              />
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-bold leading-tight">{data.coupleName || 'Nosso Casamento'}</h2>
              {data.weddingDate ? (
                <p className="text-slate-600 mt-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400">calendar_month</span>
                  {formatDatePtBR(data.weddingDate)}
                </p>
              ) : null}

              {data.description ? <p className="text-slate-700 mt-3 leading-relaxed">{data.description}</p> : null}

              <button
                onClick={share}
                className="mt-4 w-full rounded-full bg-primary text-white py-3 font-semibold shadow-soft active:scale-[0.99] transition flex items-center justify-center gap-2"
              >
                Compartilhar lista <span className="material-symbols-outlined">ios_share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-5">
          <div className="w-full rounded-full bg-white border border-gray-200 shadow-soft px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={onlyFavs ? 'Buscar nos favoritos...' : 'Buscar presentes...'}
              className="w-full outline-none text-slate-700 placeholder:text-slate-400"
            />
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                aria-label="Limpar busca"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">close</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Gift grid */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {filtered.map((g: any) => {
            const isFav = favSet.has(String(g.id))
            return (
              <Link key={g.id} href={`/presente/${g.id}?d=${d}`} className="group">
                <div className="relative rounded-3xl overflow-hidden bg-white shadow-soft border border-gray-100">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleFav(String(g.id))
                    }}
                    style={{
                      backgroundColor: isFav ? '#ef4444' : 'rgba(255,255,255,0.9)'
                    }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-soft backdrop-blur transition"
                    aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  >
                    <span className={isFav ? 'material-symbols-filled text-white' : 'material-symbols-outlined text-slate-500'}>
                      favorite
                    </span>
                  </button>

                  <img src={g.image} alt={g.title} className="w-full h-44 object-cover" />
                </div>

                <div className="mt-3">
                  <p className="text-base font-semibold leading-snug">{g.title}</p>
                  <p className="text-lg font-extrabold mt-1">{formatBRL(Number(g.price || 0))}</p>
                  <div className="mt-2 flex items-center gap-2 text-primary font-semibold text-sm">
                    <span className="material-symbols-outlined">arrow_forward</span>
                    Ver detalhes
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {filtered.length === 0 ? <div className="mt-10 text-center text-slate-500">Nenhum presente encontrado.</div> : null}
      </div>

      {/* Bottom nav: Presentes / Favoritos / Perfil */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200/60">
        <div className="mx-auto max-w-md px-6 py-3 flex items-center justify-around text-xs text-slate-500">
          <Link
            className={`flex flex-col items-center gap-1 ${isPresentesActive ? 'text-primary font-semibold' : ''}`}
            href={`/c?d=${d}`}
          >
            <span className="material-symbols-outlined">grid_view</span>
            Presentes
          </Link>

          <Link
            className={`flex flex-col items-center gap-1 ${isFavActive ? 'text-primary font-semibold' : ''}`}
            href={`/c?d=${d}&tab=favs`}
          >
            <span className={isFavActive ? 'material-symbols-filled text-primary' : 'material-symbols-outlined'}>
              favorite
            </span>
            Favoritos
          </Link>

          <Link className="flex flex-col items-center gap-1" href={`/perfil?d=${d}`}>
            <span className="material-symbols-outlined">person</span>
            Perfil
          </Link>
        </div>
      </nav>
    </main>
  )
}
