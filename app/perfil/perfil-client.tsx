'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import TopBar from '../components/TopBar'
import Toast from '../components/Toast'

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

export default function PerfilClient() {
  const sp = useSearchParams()
  const router = useRouter()
  const t = sp.get('t') || ''
  const [couple, setCouple] = useState<CoupleData | null>(null)
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [err, setErr] = useState('')

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

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined' || !t) return ''
    const url = new URL('/c', window.location.origin)
    url.searchParams.set('t', t)
    return url.toString()
  }, [t])

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setToast('Copiado ✅')
      setTimeout(() => setToast(null), 1400)
    } catch {
      setToast('Não consegui copiar 😅')
      setTimeout(() => setToast(null), 1400)
    }
  }

  const checkout = async () => {
    setErr('')
    try {
      const res = await fetch('/api/list/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ t })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erro ao iniciar pagamento')
      if (data.alreadyPaid) {
        setToast('Pix já está ativado ✅')
        setTimeout(() => setToast(null), 1400)
        return
      }
      const url = data.init_point || data.sandbox_init_point
      if (!url) throw new Error('Mercado Pago não retornou link de pagamento')
      window.location.href = url
    } catch (e: any) {
      setErr(e.message || 'Erro no pagamento')
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

  return (
    <main className="min-h-screen bg-background-light">
      <TopBar title="Perfil" />

      <div className="mx-auto max-w-md px-4 pb-28 pt-6">
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
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

          <div className="mt-4 grid gap-3">
            <div className={"rounded-2xl px-4 py-3 text-xs font-semibold " + (paid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800")}>
              {paid ? 'Pix ativado ✅ convidados já podem presentear' : 'Pix ainda não ativado'}
            </div>

            {!paid ? (
              <>
                <button
                  onClick={checkout}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white"
                >
                  Ativar Pix
                  <span className="material-symbols-outlined text-base">payments</span>
                </button>

                <div className="text-xs text-slate-500">
                  Pagamento único. Sem taxas por presente.
                </div>

                {err ? (
                  <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{err}</div>
                ) : null}
              </>
            ) : null}

            <div className="rounded-2xl border border-slate-100 p-4">
              <div className="text-xs font-bold text-slate-700">Seu link</div>
              <div className="mt-1 break-all text-xs text-slate-600">{shareUrl}</div>
              <button
                onClick={() => copy(shareUrl)}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              >
                Copiar
                <span className="material-symbols-outlined text-base">content_copy</span>
              </button>
            </div>

            <Link
              href="/criar"
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800"
            >
              Criar lista
              <span className="material-symbols-outlined text-base">add</span>
            </Link>

            <Link
              href="/duvidas"
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800"
            >
              Dúvidas
              <span className="material-symbols-outlined text-base">help</span>
            </Link>
          </div>
        </div>
      </div>

      {/* bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
          <Link href={`/c?t=${encodeURIComponent(t)}`} className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-400">
            <span className="material-symbols-outlined">redeem</span>
            Presentes
          </Link>

          <Link href={`/c?t=${encodeURIComponent(t)}&tab=favs`} className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-400">
            <span className="material-symbols-outlined">favorite</span>
            Favoritos
          </Link>

          <Link href={`/perfil?t=${encodeURIComponent(t)}`} className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-900">
            <span className="material-symbols-outlined">person</span>
            Perfil
          </Link>
        </div>
      </div>

      <Toast show={!!toast} text={toast || ''} />
    </main>
  )
}
