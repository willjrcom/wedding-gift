
'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'
import { decode } from '../../lib/encode'
import { formatBRL } from '../../lib/format'
import { readFavorites, writeFavorites } from '../../lib/favorites'

export default function ProdutoClient({ gift }: { gift: any }) {
  const d = useSearchParams().get('d')
  const [showPix, setShowPix] = useState(false)
  const [toast, setToast] = useState('')
  const [favSet, setFavSet] = useState<Set<string>>(new Set())

  const data: any = useMemo(() => {
    if (!d) return null
    return decode(d)
  }, [d])

  useEffect(() => {
    setFavSet(new Set(readFavorites()))
  }, [])

  if (!d || !data) return null

  const isFav = favSet.has(String(gift.id))

  function flash(msg: string) {
    setToast(msg)
    window.clearTimeout((flash as any)._t)
    ;(flash as any)._t = window.setTimeout(() => setToast(''), 1500)
  }

  function persist(next: Set<string>) {
    setFavSet(next)
    writeFavorites(Array.from(next))
  }

  function toggleFav() {
    const next = new Set(favSet)
    const id = String(gift.id)
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

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(String(data.pixKey || ''))
      flash('Chave Pix copiada!')
    } catch {
      // silent
    }
  }

  return (
    <main className="min-h-screen">
      <TopBar
        title="Detalhes"
        backHref={`/c?d=${d}`}
        right={
          <button
            onClick={toggleFav}
            className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center active:scale-[0.98] transition"
            aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <span className={isFav ? 'material-symbols-filled text-primary' : 'material-symbols-outlined text-slate-500'}>
              favorite
            </span>
          </button>
        }
      />

      <Toast show={!!toast} text={toast} />

      <div className="mx-auto max-w-md px-4 pb-32">
        <div className="mt-4 rounded-[2.5rem] overflow-hidden bg-white shadow-soft border border-gray-100">
          <img src={gift.image} alt={gift.title} className="w-full h-[420px] object-cover" />
        </div>

        <div className="flex justify-center gap-2 mt-3">
          <span className="w-7 h-1.5 rounded-full bg-primary" />
          <span className="w-2.5 h-1.5 rounded-full bg-gray-300" />
          <span className="w-2.5 h-1.5 rounded-full bg-gray-300" />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold leading-tight">{gift.title}</h1>

        <div className="mt-3 flex items-center gap-3">
          <div className="text-primary text-2xl font-extrabold">{formatBRL(Number(gift.price || 0))}</div>
          <div className="rounded-full bg-green-100 text-green-900 px-3 py-2 text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-filled">payments</span>
            PIX
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-white shadow-soft border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={data.imageUrl || 'https://via.placeholder.com/200x200?text=%F0%9F%92%9C'}
              alt="Casal"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="font-bold">{data.coupleName || 'Casal'}</div>
            <div className="text-sm text-slate-600">Presente para o casamento</div>
          </div>
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">chat</span>
          </div>
        </div>

        <p className="mt-4 text-slate-700 leading-relaxed">
          {gift.description || 'Um presente cheio de carinho para ajudar nessa nova fase.'}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-3xl bg-white border border-gray-100 shadow-soft p-4">
            <div className="text-xs font-bold tracking-widest text-slate-400">TIPO PIX</div>
            <div className="mt-2 font-semibold">{data.pixType || '-'}</div>
          </div>
          <div className="rounded-3xl bg-white border border-gray-100 shadow-soft p-4">
            <div className="text-xs font-bold tracking-widest text-slate-400">ENTREGA</div>
            <div className="mt-2 font-semibold">Imediata</div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background-light/90 backdrop-blur-md border-t border-gray-200/60">
        <div className="mx-auto max-w-md px-4 py-4 flex flex-col gap-3">
          {!showPix ? (
            <button
              onClick={() => setShowPix(true)}
              className="w-full rounded-full bg-primary text-white py-4 font-bold shadow-soft flex items-center justify-center gap-2 active:scale-[0.99] transition"
            >
              <span className="material-symbols-outlined">redeem</span>
              Presentear
            </button>
          ) : (
            <>
              <div className="rounded-2xl bg-white border border-gray-200 shadow-soft px-4 py-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">key</span>
                <div className="flex-1 font-mono text-sm text-slate-700 truncate">{String(data.pixKey || '')}</div>
                <button
                  onClick={copyPix}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                  aria-label="Copiar"
                >
                  <span className="material-symbols-outlined text-primary">content_copy</span>
                </button>
              </div>

              <button
                onClick={copyPix}
                className="w-full rounded-full bg-primary text-white py-4 font-bold shadow-soft flex items-center justify-center gap-2 active:scale-[0.99] transition"
              >
                <span className="material-symbols-outlined">content_copy</span>
                Copiar chave PIX
              </button>

              <button
                onClick={() => setShowPix(false)}
                className="w-full rounded-full bg-white text-primary py-4 font-bold border border-primary/30 shadow-soft active:scale-[0.99] transition"
              >
                Voltar
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
