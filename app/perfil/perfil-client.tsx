'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import Toast from '../components/Toast'
import { decode } from '../lib/encode'
import { formatDatePtBR } from '../lib/format'

export default function PerfilClient() {
  const sp = useSearchParams()
  const d = sp.get('d')

  const [toast, setToast] = useState('')

  const data: any = useMemo(() => {
    if (!d) return null
    return decode(d)
  }, [d])

  if (!d || !data) return null

  function flash(msg: string) {
    setToast(msg)
    window.clearTimeout((flash as any)._t)
    ;(flash as any)._t = window.setTimeout(() => setToast(''), 1500)
  }

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(String(data.pixKey || ''))
      flash('Chave Pix copiada!')
    } catch {
      // ignore
    }
  }

  async function share() {
    const url = `${window.location.origin}/c?d=${d}`
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

  return (
    <main className="min-h-screen">
      <TopBar
        title="Perfil"
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
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="rounded-3xl bg-white border border-gray-100 shadow-soft p-4">
            <div className="text-xs font-bold tracking-widest text-slate-400">CHAVE PIX</div>
            <div className="mt-2 font-mono text-sm text-slate-700 break-all">{String(data.pixKey || '-')}</div>

            {data.pixKey ? (
              <button
                onClick={copyPix}
                className="mt-4 w-full rounded-full bg-primary text-white py-3 font-semibold shadow-soft active:scale-[0.99] transition flex items-center justify-center gap-2"
              >
                Copiar chave Pix <span className="material-symbols-outlined">content_copy</span>
              </button>
            ) : null}
          </div>

          <div className="rounded-3xl bg-white border border-gray-100 shadow-soft p-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-bold tracking-widest text-slate-400">TIPO</div>
              <div className="mt-2 font-semibold text-slate-800">{String(data.pixType || '-')}</div>
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-slate-400">DATA</div>
              <div className="mt-2 font-semibold text-slate-800">
                {data.weddingDate ? formatDatePtBR(data.weddingDate) : '-'}
              </div>
            </div>
          </div>

          <Link
            href="/criar"
            className="w-full rounded-full bg-black text-white py-4 font-bold shadow-soft active:scale-[0.99] transition flex items-center justify-center gap-2"
          >
            Criar lista <span className="material-symbols-outlined">add</span>
          </Link>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200/60">
        <div className="mx-auto max-w-md px-6 py-3 flex items-center justify-around text-xs text-slate-500">
          <Link className="flex flex-col items-center gap-1" href={`/c?d=${d}`}>
            <span className="material-symbols-outlined">grid_view</span>
            Presentes
          </Link>

          <Link className="flex flex-col items-center gap-1" href={`/c?d=${d}&tab=favs`}>
            <span className="material-symbols-outlined">favorite</span>
            Favoritos
          </Link>

          <Link className="flex flex-col items-center gap-1 text-primary font-semibold" href={`/perfil?d=${d}`}>
            <span className="material-symbols-outlined">person</span>
            Perfil
          </Link>
        </div>
      </nav>
    </main>
  )
}
