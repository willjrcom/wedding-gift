import { NextResponse } from 'next/server'
import { getPayment } from '@/app/lib/mercadopago'
import { markPaid, getList } from '@/app/lib/store'
import { sendEmail, notifyEmails } from '@/app/lib/email'
import { encryptToken } from '@/app/lib/token'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))

    // Mercado Pago pode enviar formatos diferentes
    const paymentId = String(body?.data?.id || body?.id || '')
    if (!paymentId) return NextResponse.json({ ok: true })

    const payment = await getPayment(paymentId)
    const status = String(payment?.status || '')
    const listId = String(payment?.metadata?.listId || payment?.external_reference || '')

    if (!listId) return NextResponse.json({ ok: true })

    if (status === 'approved') {
      const updated = await markPaid(listId)
      if (!updated) return NextResponse.json({ ok: true })

      const token = encryptToken({ listId })
      const base = process.env.APP_URL || ''
      const link = `${base}/c?t=${token}`

      const toAdmin = notifyEmails()
      const clientEmail = updated.data.email

      await Promise.all([
        toAdmin.length
          ? sendEmail({
              to: toAdmin,
              subject: `Pagamento aprovado: ${updated.data.coupleName}`,
              html: `
                <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5">
                  <h2>Pagamento aprovado ✅</h2>
                  <p><b>Casal:</b> ${updated.data.coupleName}</p>
                  <p><b>Payment ID:</b> ${paymentId}</p>
                  <p><b>Link:</b> <a href="${link}">${link}</a></p>
                </div>
              `
            })
          : Promise.resolve(null),
        sendEmail({
          to: [clientEmail],
          subject: 'Pix ativado ✅ Sua lista já aceita presentes',
          html: `
            <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5">
              <h2>Pix ativado ✅</h2>
              <p>Agora seus convidados já conseguem clicar em <b>Presentear</b> e copiar o Pix.</p>
              <p><a href="${link}">${link}</a></p>
            </div>
          `
        })
      ])
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('webhook error', err)
    // MP espera 200; não queremos ficar em retry infinito
    return NextResponse.json({ ok: true })
  }
}
