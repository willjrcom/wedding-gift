
'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import gifts from '../data/gifts.json'
import TopBar from '../components/TopBar'
import Toast from '../components/Toast'
import { decode } from '../lib/encode'
import { formatBRL, formatDatePtBR } from '../lib/format'

export default function Casal() {
  const d = useSearchParams().get('d')
  const [toast, setToast] = useState('')

  const data: any = useMemo(() => {
    if (!d) return null
    try {
      return decode(d)
    } catch {
      return { __invalid: true }
    }
  }, [d])

  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: data?.coupleName || 'Lista de Presentes',
          text: 'Acesse nossa lista de presentes 💜',
          url
        })
        return
      }
      await navigator.clipboard.writeText(url)
      setToast('Link copiado!')
      setTimeout(() => setToast(''), 1500)
    } catch {
      // ignore
    }
  }

  if (!d || !data) return null

  if (data.__invalid) {
    return (
      <main className="min-h-screen">
        <TopBar title="Presentes" backHref="/criar" />
        <div className="mx-auto max-w-md px-4 py-10">
          <div className="rounded-3xl bg-white shadow-soft border border-gray-100 p-6">
            <h2 className="text-xl font-bold">Link inválido</h2>
            <p className="text-slate-600 mt-2">Gere um novo link para compartilhar.</p>
            <a
              href="/criar"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-primary py-4 text-white font-semibold shadow-soft"
            >
              Criar nova lista
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <TopBar
        title="Presentes"
        backHref="/criar"
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

        {/* Search bar like example */}
        <div className="mt-5">
          <div className="w-full rounded-full bg-white border border-gray-200 shadow-soft px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">search</span>
            <input
              placeholder="Buscar presentes..."
              className="w-full outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          <button className="shrink-0 rounded-full bg-primary text-white px-4 py-2 font-semibold flex items-center gap-2 shadow-soft">
            <span className="material-symbols-outlined">tune</span>
            Filtrar
          </button>
          <button className="shrink-0 rounded-full bg-white border border-gray-200 px-4 py-2 font-semibold flex items-center gap-2 shadow-soft">
            <span className="material-symbols-outlined">payments</span>
            Pix
          </button>
          <button className="shrink-0 rounded-full bg-white border border-gray-200 px-4 py-2 font-semibold flex items-center gap-2 shadow-soft">
            <span className="material-symbols-outlined">favorite</span>
            Favoritos
          </button>
        </div>

        {/* Gift grid */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {gifts.map((g: any) => (
            <Link key={g.id} href={`/presente/${g.id}?d=${d}`} className="group">
              <div className="relative rounded-3xl overflow-hidden bg-white shadow-soft border border-gray-100">
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-soft">
                  <span className="material-symbols-outlined text-slate-500">favorite</span>
                </div>
                <img src={g.image} alt={g.title} className="w-full h-44 object-cover" />
              </div>

              <div className="mt-3">
                <p className="text-base font-semibold leading-snug">{g.title}</p>
                <p className="text-lg font-extrabold mt-1">{formatBRL(Number(g.price || 0))}</p>
                <div className="mt-2 flex items-center gap-2 text-primary font-semibold text-sm">
                  <span className="material-symbols-outlined">payments</span>
                  Presentear via Pix
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom nav like example */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200/60">
        <div className="mx-auto max-w-md px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <a className="flex flex-col items-center gap-1" href={`/c?d=${d}`}>
            <span className="material-symbols-outlined">home</span>
            Início
          </a>
          <a className="flex flex-col items-center gap-1 text-primary font-semibold" href={`/c?d=${d}`}>
            <span className="material-symbols-outlined">grid_view</span>
            Presentes
          </a>
          <button className="flex flex-col items-center gap-1" onClick={share}>
            <span className="material-symbols-outlined">share</span>
            Compartilhar
          </button>
          <a className="flex flex-col items-center gap-1" href="/">
            <span className="material-symbols-outlined">person</span>
            Perfil
          </a>
        </div>
      </nav>
    </main>
  )
}
