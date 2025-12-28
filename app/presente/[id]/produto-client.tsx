
'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'
import { decode } from '../../lib/encode'
import { formatBRL } from '../../lib/format'

export default function ProdutoClient({ gift }: { gift: any }) {
  const d = useSearchParams().get('d')
  const [showPix, setShowPix] = useState(false)
  const [toast, setToast] = useState('')

  const data: any = useMemo(() => {
    if (!d) return null
    try {
      return decode(d)
    } catch {
      return { __invalid: true }
    }
  }, [d])

  if (!d || !data) return null

  if (data.__invalid) {
    return (
      <main className="min-h-screen">
        <TopBar title="Detalhes" backHref="/criar" />
        <div className="mx-auto max-w-md px-4 py-10">
          <div className="rounded-3xl bg-white shadow-soft border border-gray-100 p-6">
            <h2 className="text-xl font-bold">Link inválido</h2>
            <p className="text-slate-600 mt-2">Volte e gere um novo link.</p>
            <a href="/criar" className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-primary py-4 text-white font-semibold shadow-soft">Gerar link</a>
          </div>
        </div>
      </main>
    )
  }

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(String(data.pixKey || ''))
      setToast('Chave Pix copiada!')
      setTimeout(() => setToast(''), 1500)
    } catch {
      // silent
    }
  }

  return (
    <main className="min-h-screen">
      <TopBar title="Detalhes" backHref={`/c?d=${d}`} right={<span className="material-symbols-filled text-primary">favorite</span>} />

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

        {/* Seller / couple info card */}
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

        {/* Info pills */}
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

      {/* Bottom action area like example */}
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
