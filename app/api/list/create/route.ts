import { NextResponse } from 'next/server'
import { createList } from '@/app/lib/store'
import { encryptToken } from '@/app/lib/token'
import { sendEmail, notifyEmails } from '@/app/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const payload = {
      coupleName: String(body.coupleName || '').trim(),
      weddingDate: String(body.weddingDate || '').trim(),
      description: String(body.description || '').trim(),
      pixType: String(body.pixType || '').trim(),
      pixKey: String(body.pixKey || '').trim(),
      imageUrl: String(body.imageUrl || '').trim(),
      email: String(body.email || '').trim(),

      // opcionais (informações do evento)
      ceremonyAddress: String(body.ceremonyAddress || '').trim(),
      partyAddress: String(body.partyAddress || '').trim(),
      ceremonyMapUrl: String(body.ceremonyMapUrl || '').trim(),
      partyMapUrl: String(body.partyMapUrl || '').trim(),
      dressCode: String(body.dressCode || '').trim(),
      ceremonyTime: String(body.ceremonyTime || '').trim(),
      partyTime: String(body.partyTime || '').trim()
    }

    // Validações (na ordem solicitada)
    if (!payload.pixType || !payload.pixKey) {
      return NextResponse.json({ error: 'Preencha chave Pix e tipo de chave.' }, { status: 400 })
    }
    if (!payload.coupleName) {
      return NextResponse.json({ error: 'Preencha o nome do casal.' }, { status: 400 })
    }
    if (!payload.weddingDate) {
      return NextResponse.json({ error: 'Preencha a data do casamento.' }, { status: 400 })
    }
    if (!payload.description) {
      return NextResponse.json({ error: 'Preencha a descrição.' }, { status: 400 })
    }
    if (!payload.email) {
      return NextResponse.json({ error: 'Preencha o e-mail.' }, { status: 400 })
    }

    const list = await createList(payload)
    const token = encryptToken({ listId: list.id })
    const base = process.env.APP_URL || ''
    const link = `${base}/c?t=${token}`

    // e-mail (admin + cliente)
    const toAdmin = notifyEmails()
    const toClient = [payload.email]

    const htmlBase = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5">
        <h2>Lista criada</h2>
        <p><b>Casal:</b> ${payload.coupleName}</p>
        <p><b>Data:</b> ${payload.weddingDate}</p>
        <p><b>Link:</b> <a href="${link}">${link}</a></p>
        <p style="color:#666">Obs: o Pix só é liberado após pagamento (Ativar Pix).</p>
      </div>
    `

    await Promise.all([
      toAdmin.length
        ? sendEmail({
            to: toAdmin,
            subject: `Nova lista criada: ${payload.coupleName}`,
            html: htmlBase
          })
        : Promise.resolve(null),
      sendEmail({
        to: toClient,
        subject: 'Sua lista de presentes foi criada ✅',
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5">
            <h2>Sua lista está pronta!</h2>
            <p>Você já pode compartilhar com os convidados:</p>
            <p><a href="${link}">${link}</a></p>
            <p style="color:#666">Para liberar o Pix para presentear, entre em Perfil e clique em <b>Ativar Pix</b>.</p>
          </div>
        `
      })
    ])

    return NextResponse.json({ token, link, listId: list.id })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err?.message || 'Erro inesperado' }, { status: 500 })
  }
}
