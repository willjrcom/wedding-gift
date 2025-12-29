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
      <!-- ✅ TEMPLATE: ADMIN (você) - Lista criada -->
<div style="margin:0;padding:0;background:#f6f7fb">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #eef0f4">
      <div style="padding:18px 20px;background:linear-gradient(135deg,#0f172a,#334155)">
        <div style="font-family:Arial,Helvetica,sans-serif;color:#fff;font-weight:700;font-size:16px;letter-spacing:.2px">
          Wedding Gift
        </div>
        <div style="font-family:Arial,Helvetica,sans-serif;color:#cbd5e1;font-size:12px;margin-top:6px">
          Notificação automática
        </div>
      </div>

      <div style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#0f172a">
        <h2 style="margin:0 0 10px 0;font-size:18px">Lista criada ✅</h2>

        <div style="background:#f8fafc;border:1px solid #eef2f7;border-radius:14px;padding:14px">
          <p style="margin:0 0 6px 0"><b>Casal:</b> ${payload.coupleName}</p>
          <p style="margin:0 0 6px 0"><b>Data do casamento:</b> ${payload.weddingDate}</p>
          <p style="margin:0"><b>E-mail:</b> ${payload.email}</p>
        </div>

        <div style="margin-top:14px">
          <div style="font-size:12px;color:#64748b;margin-bottom:8px">Link da lista</div>

          <a href="${link}"
            style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:700;
                  padding:12px 14px;border-radius:14px">
            Abrir lista
          </a>

          <div style="margin-top:10px;font-size:12px;color:#64748b;word-break:break-all">
            ${link}
          </div>
        </div>

        <div style="margin-top:14px;background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;padding:12px">
          <div style="font-size:12px;color:#9a3412">
            <b>Obs:</b> o Pix só é liberado após pagamento (<b>Ativar Pix</b>).
          </div>
        </div>

        <div style="margin-top:16px;font-size:11px;color:#94a3b8">
          Enviado automaticamente • Se não foi você, ignore este e-mail.
        </div>
      </div>
    </div>
  </div>
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
          <!-- ✅ TEMPLATE: CLIENTE - Sua lista está pronta -->
<div style="margin:0;padding:0;background:#f6f7fb">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #eef0f4">
      <div style="padding:18px 20px;background:linear-gradient(135deg,#16a34a,#22c55e)">
        <div style="font-family:Arial,Helvetica,sans-serif;color:#fff;font-weight:800;font-size:16px;letter-spacing:.2px">
          Sua lista está pronta! 🎁
        </div>
        <div style="font-family:Arial,Helvetica,sans-serif;color:#dcfce7;font-size:12px;margin-top:6px">
          Compartilhe com seus convidados em 1 clique
        </div>
      </div>

      <div style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#0f172a">
        <h2 style="margin:0 0 10px 0;font-size:18px">Tudo certo, ${payload.coupleName} ✅</h2>

        <div style="background:#f8fafc;border:1px solid #eef2f7;border-radius:14px;padding:14px">
          <p style="margin:0 0 6px 0"><b>Data do casamento:</b> ${payload.weddingDate}</p>
          <p style="margin:0;color:#475569">${payload.description || ""}</p>
        </div>

        <div style="margin-top:14px">
          <div style="font-size:12px;color:#64748b;margin-bottom:8px">Seu link para compartilhar</div>

          <a href="${link}"
            style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;font-weight:800;
                  padding:12px 14px;border-radius:14px">
            Abrir e compartilhar
          </a>

          <div style="margin-top:10px;font-size:12px;color:#64748b;word-break:break-all">
            ${link}
          </div>
        </div>

        <div style="margin-top:14px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:14px;padding:12px">
          <div style="font-size:12px;color:#1e40af">
            Para liberar o Pix para presentear, entre em <b>Perfil</b> e clique em <b>Ativar Pix</b>.
          </div>
        </div>

        <div style="margin-top:16px;font-size:11px;color:#94a3b8">
          Dica: use o botão “Compartilhar” dentro do site para mandar no WhatsApp rapidinho.
        </div>
      </div>
    </div>
  </div>
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
