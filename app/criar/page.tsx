
'use client'

import { useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import InputField from '../components/InputField'
import PillButton from '../components/PillButton'
import { encode } from '../lib/encode'

export default function Criar() {
  const [imageUrl, setImageUrl] = useState('')
  const preview = useMemo(() => imageUrl?.trim(), [imageUrl])

  function onSubmit(e: any) {
    e.preventDefault()
    const raw = Object.fromEntries(new FormData(e.target))
    const payload = {
      coupleName: String(raw.coupleName || '').trim(),
      weddingDate: String(raw.weddingDate || '').trim(),
      description: String(raw.description || '').trim(),
      pixType: String(raw.pixType || 'CPF').trim(),
      pixKey: String(raw.pixKey || '').trim(),
      imageUrl: String(raw.imageUrl || '').trim()
    }

    const d = encode(payload)
    window.location.href = `/c?d=${d}`
  }

  return (
    <main className="min-h-screen">
      <TopBar title="Cadastro de Casal" backHref="/" />

      <div className="mx-auto max-w-md px-4 pb-32">
        {/* Avatar / photo */}
        <div className="flex flex-col items-center justify-center pt-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-primary/10 shadow-soft flex items-center justify-center">
              {preview ? (
                // Any external image is allowed (native img)
                <img src={preview} alt="Foto do casal" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-filled text-primary text-4xl">favorite</span>
              )}
            </div>

            <div className="absolute -right-1 -bottom-1 w-12 h-12 rounded-full bg-primary shadow-soft flex items-center justify-center border-4 border-background-light">
              <span className="material-symbols-outlined text-white">photo_camera</span>
            </div>
          </div>

          <p className="text-slate-600 mt-3">Adicionar foto do casal</p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">URL da Foto</label>
              <input
                name="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-2xl bg-white border border-gray-200 px-4 py-4 text-base outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <InputField name="coupleName" label="Nome do Casal" placeholder="Ex: Maria & João" icon="person" required />
            <InputField name="weddingDate" label="Data do Casamento" type="date" icon="calendar_month" required />
            <InputField
              name="description"
              label="Descrição"
              placeholder="Conte um pouco sobre a história de vocês..."
              icon="edit_note"
              as="textarea"
            />
          </div>

          <div className="border-t border-gray-200/70 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <span className="material-symbols-filled text-green-700">payments</span>
              </div>
              <h2 className="text-lg font-bold">Dados para Recebimento</h2>
            </div>

            <div className="flex flex-col gap-5">
              <InputField name="pixType" label="Tipo de Chave" as="select" icon="badge" required />
              <InputField name="pixKey" label="Chave Pix" placeholder="Digite sua chave" icon="key" required />

              <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 text-slate-700 flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-soft">
                  <span className="material-symbols-filled text-primary">verified</span>
                </div>
                <p className="text-sm leading-relaxed">
                  Seus presentes serão transferidos para esta chave PIX. Compartilhe o link com seus convidados.
                </p>
              </div>
            </div>
          </div>

          {/* Fixed CTA like the example */}
          <div className="fixed bottom-0 left-0 right-0 bg-background-light/90 backdrop-blur-md border-t border-gray-200/50">
            <div className="mx-auto max-w-md px-4 py-4">
              <PillButton type="submit">
                Gerar link <span className="material-symbols-outlined">arrow_forward</span>
              </PillButton>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
