import Link from 'next/link'
import { decryptToken, encryptToken } from '@/app/lib/token'
import { getPayment } from '@/app/lib/mercadopago'
import { markPaid, getList } from '@/app/lib/store'
import { sendEmail, notifyEmails } from '@/app/lib/email'

export default async function Page({ searchParams }: { searchParams: any }) {
  const t = String(searchParams?.t || '')
  const paymentId = String(searchParams?.payment_id || searchParams?.paymentId || '')

  let ok = false
  let link = '/'
  let msg = 'Pagamento confirmado.'
  let coupleName = ''

  try {
    const decoded = decryptToken(t)
    const listId = String(decoded?.listId || '')
    if (listId) {
      const token = encryptToken({ listId })
      link = `/c?t=${encodeURIComponent(token)}`

      // tenta verificar pelo payment_id (quando tem redirect)
      if (paymentId) {
        const payment = await getPayment(paymentId)
        const status = String(payment?.status || '')

if (status === 'approved') {
          const updated = await markPaid(listId)

          if (updated) {
            ok = true
            coupleName = updated.data.coupleName

            // webhook também envia; aqui garante caso o redirect chegue antes
            const toAdmin = notifyEmails()
            await Promise.all([
              toAdmin.length
                ? sendEmail({
                    to: toAdmin,
                    subject: `Pagamento aprovado (redirect): ${updated.data.coupleName}`,
                    html: `<p>Pagamento aprovado via redirect. Payment ID: ${paymentId}</p>`
                  })
                : Promise.resolve(null),
              sendEmail({
                to: [updated.data.email],
                subject: 'Pix ativado ✅ Sua lista já aceita presentes',
                html: `<p>Pix ativado! Link: <a href="${process.env.APP_URL}/c?t=${token}">${process.env.APP_URL}/c?t=${token}</a></p>`
              })
            ])
          } else {
            // já estava pago (provavelmente webhook já processou)
            const already = await getList(listId)
            ok = true
            coupleName = already?.data?.coupleName || ''
          }
        } else {

          msg = `Pagamento com status: ${status}`
        }
      } else {
        // sem payment_id, só confirma que existe lista
        const list = await getList(listId)
        coupleName = list?.data?.coupleName || ''
      }
    }
  } catch {
    msg = 'Link inválido.'
  }

  return (
    <main className="min-h-screen bg-background-light">
      <div className="mx-auto max-w-md px-4 pt-14">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <div className="text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h1 className="text-xl font-extrabold">{ok ? 'Pix ativado!' : 'Pagamento recebido'}</h1>
            <p className="mt-2 text-sm text-slate-600">{msg}</p>
            {coupleName ? <p className="mt-2 text-sm text-slate-500">Lista: {coupleName}</p> : null}
          </div>

          <div className="mt-6 grid gap-3">
            <Link
              href={link}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white"
            >
              Voltar para minha lista
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
