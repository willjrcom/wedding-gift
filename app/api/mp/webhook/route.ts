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
            <!-- ✅ TEMPLATE: CLIENTE + ADMIN - Pix ativado -->
<div style="margin:0;padding:0;background:#f6f7fb">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #eef0f4">
      <div style="padding:18px 20px;background:linear-gradient(135deg,#7c3aed,#a78bfa)">
        <div style="font-family:Arial,Helvetica,sans-serif;color:#fff;font-weight:900;font-size:16px;letter-spacing:.2px">
          Pix ativado ✅
        </div>
        <div style="font-family:Arial,Helvetica,sans-serif;color:#f3e8ff;font-size:12px;margin-top:6px">
          Agora seus convidados conseguem presentear
        </div>
      </div>

      <div style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#0f172a">
        <h2 style="margin:0 0 10px 0;font-size:18px">Pronto! 🎉</h2>

        <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:14px;padding:12px">
          <div style="font-size:12px;color:#6b21a8">
            Seus convidados já conseguem clicar em <b>Presentear</b> e copiar o Pix.
          </div>
        </div>

        <div style="margin-top:14px">
          <div style="font-size:12px;color:#64748b;margin-bottom:8px">Link da lista</div>

          <a href="${link}"
            style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;font-weight:900;
                  padding:12px 14px;border-radius:14px">
            Abrir lista
          </a>

          <div style="margin-top:10px;font-size:12px;color:#64748b;word-break:break-all">
            ${link}
          </div>
        </div>

        <div style="margin-top:16px;font-size:11px;color:#94a3b8">
          Se você não reconhece este pagamento, verifique a conta do Mercado Pago.
        </div>
      </div>
    </div>
  </div>
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
