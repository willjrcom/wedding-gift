import Link from 'next/link'
import TopBar from '../components/TopBar'

const faqs = [
  {
    q: 'Como funciona?',
    a: 'Você cria a lista, compartilha o link e os convidados escolhem um presente. O pagamento do presente é via Pix.'
  },
  {
    q: 'O Pix aparece para todo mundo?',
    a: 'Só depois que você ativa o Pix (pagamento único). Antes disso, a lista funciona, mas o botão “Presentear” fica bloqueado.'
  },
  {
    q: 'Os favoritos ficam salvos?',
    a: 'Sim — ficam só no navegador de quem está usando (localStorage).'
  },
  {
    q: 'Posso usar qualquer imagem?',
    a: 'Sim. Você pode colar qualquer URL de imagem (Instagram, Drive, CDN, etc).'
  },
  {
    q: 'Como ativar o Pix?',
    a: 'Abra o seu Perfil e clique em “Ativar Pix”. Você será redirecionado para o Mercado Pago.'
  },
  {
    q: 'Precisa criar conta?',
    a: 'Não. O link é o seu “acesso”. Guarde-o e mantenha salvo.'
  }
]

export default function Page() {
  return (
    <main className="min-h-screen bg-background-light">
      <TopBar title="Dúvidas" backHref="/" />

      <div className="mx-auto max-w-md px-4 pb-24 pt-6">
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <h2 className="text-base font-extrabold">Perguntas frequentes</h2>

          <div className="mt-4 grid gap-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 p-4">
                <div className="text-sm font-bold text-slate-900">{f.q}</div>
                <div className="mt-1 text-sm text-slate-600">{f.a}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 text-center text-xs text-slate-500">
            Suporte: envie um e-mail para <span className="font-semibold">{process.env.ADMIN_EMAIL || 'o responsável do site'}</span>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href="/criar"
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Criar minha lista
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
