'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import InputField from '../components/InputField'
import TopBar from '../components/TopBar'
import Link from 'next/link'

const pixOptions = [
  { value: 'CPF', label: 'CPF' },
  { value: 'Telefone', label: 'Telefone' },
  { value: 'Email', label: 'E-mail' },
  { value: 'Aleatória', label: 'Chave aleatória' }
]

export default function CriarPage() {
  const router = useRouter()

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
	const [imageFile, setImageFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    coupleName: '',
    weddingDate: today,
    description: '',
    pixType: 'CPF',
    pixKey: '',
    imageUrl: '',
    email: '',

    // opcionais (informações do evento)
    ceremonyAddress: '',
    ceremonyMapUrl: '',
    ceremonyTime: '',
    partyAddress: '',
    partyMapUrl: '',
    partyTime: '',
    dressCode: ''
  })

  const set = (k: string, v: string) => setForm(s => ({ ...s, [k]: v }))

	const submit = async () => {
    setError('')
    setLoading(true)
    try {
			let payload = { ...form }

			// Optional: upload image to volume when a file is selected
			if (imageFile) {
				const fd = new FormData()
				fd.append('file', imageFile)
				const upRes = await fetch('/api/upload', { method: 'POST', body: fd })
				const upData = await upRes.json()
				if (!upRes.ok) throw new Error(upData?.error || 'Erro ao enviar imagem')
				payload.imageUrl = upData.url
			}

      const res = await fetch('/api/list/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erro ao criar lista')
      router.push(`/c?t=${encodeURIComponent(data.token)}`)
    } catch (e: any) {
      setError(e.message || 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background-light">
      <TopBar title="Criar lista" backHref="/" />

      <div className="mx-auto max-w-md px-4 pb-28 pt-6">
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-lg font-extrabold">Cadastre o casal</h1>
              <p className="mt-1 text-sm text-slate-600">Crie sua lista e compartilhe com os convidados.</p>
            </div>

            <Link
              href="/duvidas"
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Dúvidas
              <span className="material-symbols-outlined text-base">help</span>
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            <InputField label="Nome do casal" placeholder="Ex: Will e Duda" value={form.coupleName} onChange={v => set('coupleName', v)} />
            <InputField label="Data do casamento" type="date" value={form.weddingDate} onChange={v => set('weddingDate', v)} />
            <InputField
              label="Mensagem"
              placeholder="Ex: Venha celebrar com a gente!"
              value={form.description}
              onChange={v => set('description', v)}
              required
            />

            <InputField
              label="Seu e-mail"
              placeholder="pra receber o link"
              value={form.email}
              onChange={v => set('email', v)}
              required
            />

            <div className="mt-2 text-xs font-bold text-slate-700">Detalhes do evento (opcional)</div>

            <InputField
              label="Hora da cerimônia"
              type="time"
              value={form.ceremonyTime}
              onChange={v => set('ceremonyTime', v)}
            />
            <InputField
              label="Endereço da cerimônia"
              placeholder="Ex: Igreja X, Rua Y, 123"
              value={form.ceremonyAddress}
              onChange={v => set('ceremonyAddress', v)}
            />
            <InputField
              label="Link do endereço da cerimônia"
              type="url"
              placeholder="Ex: https://maps.google.com/..."
              value={form.ceremonyMapUrl}
              onChange={v => set('ceremonyMapUrl', v)}
            />

            <InputField
              label="Hora da festa"
              type="time"
              value={form.partyTime}
              onChange={v => set('partyTime', v)}
            />
            <InputField
              label="Endereço da festa"
              placeholder="Ex: Buffet Z, Av. W, 999"
              value={form.partyAddress}
              onChange={v => set('partyAddress', v)}
            />
            <InputField
              label="Link do endereço da festa"
              type="url"
              placeholder="Ex: https://maps.google.com/..."
              value={form.partyMapUrl}
              onChange={v => set('partyMapUrl', v)}
            />

            <InputField
              label="Traje"
              placeholder="Ex: esporte fino / social / casual"
              value={form.dressCode}
              onChange={v => set('dressCode', v)}
            />

            <div className="mt-2 text-xs font-bold text-slate-700">Pix</div>

            <InputField
              label="Tipo de chave Pix"
              as="select"
              value={form.pixType}
              onChange={v => set('pixType', v)}
              options={pixOptions}
              required
            />

            <InputField
              label="Chave Pix"
              placeholder="Você só libera para convidados após ativar Pix"
              value={form.pixKey}
              onChange={v => set('pixKey', v)}
              required
            />

			<div className="-mt-1">
				<div className="mb-1 text-sm font-medium text-slate-800">Imagem do casal (arquivo)</div>
				<input
					type="file"
					accept="image/*"
					onChange={e => setImageFile(e.target.files?.[0] || null)}
					className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
				/>
				<div className="mt-1 text-xs text-slate-500">Opcional. Se você enviar um arquivo, ele será armazenado no servidor.</div>
			</div>

            {error ? (
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>
            ) : null}

            <button
              onClick={submit}
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? 'Gerando…' : 'Gerar link'}
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>

            <div className="text-center text-xs text-slate-500">
              Você recebe o link por e-mail (e também pode copiar na próxima tela).
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
