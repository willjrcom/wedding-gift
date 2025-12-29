import { NextResponse } from 'next/server'
import { decryptToken } from '@/app/lib/token'
import { getList } from '@/app/lib/store'
import { createPreference } from '@/app/lib/mercadopago'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const t = String(body?.t || '')
    if (!t) return NextResponse.json({ error: 'Token ausente' }, { status: 400 })

    const decoded = decryptToken(t)
    const listId = String(decoded?.listId || '')
    if (!listId) return NextResponse.json({ error: 'Token inválido' }, { status: 400 })

    const list = await getList(listId)
    if (!list) return NextResponse.json({ error: 'Lista não encontrada' }, { status: 404 })
    if (list.paid) return NextResponse.json({ ok: true, alreadyPaid: true })

    const appUrl = process.env.APP_URL || ''
    const price = Number(process.env.PRO_PRICE_BRL || 79)

    const pref = await createPreference({
      title: 'Ativar Pix da lista de presentes',
      price,
      backUrls: {
        success: `${appUrl}/pagamento/sucesso?t=${encodeURIComponent(t)}`,
        pending: `${appUrl}/pagamento/pendente?t=${encodeURIComponent(t)}`,
        failure: `${appUrl}/pagamento/erro?t=${encodeURIComponent(t)}`
      },
      notificationUrl: `${appUrl}/api/mp/webhook`,
      externalReference: list.id,
      metadata: { listId: list.id }
    })

    return NextResponse.json({ ok: true, init_point: pref.init_point, sandbox_init_point: pref.sandbox_init_point })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err?.message || 'Erro no checkout' }, { status: 500 })
  }
}
