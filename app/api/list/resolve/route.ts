import { NextResponse } from 'next/server'
import { decryptToken } from '@/app/lib/token'
import { getList } from '@/app/lib/store'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const t = searchParams.get('t') || ''
    if (!t) return NextResponse.json({ error: 'Token ausente' }, { status: 400 })

    const decoded = decryptToken(t)
    const listId = String(decoded?.listId || '')
    if (!listId) return NextResponse.json({ error: 'Token inválido' }, { status: 400 })

    const list = await getList(listId)
    if (!list) return NextResponse.json({ error: 'Lista não encontrada' }, { status: 404 })

    const safe = {
      id: list.id,
      paid: list.paid,
      createdAt: list.createdAt,
      data: {
        coupleName: list.data.coupleName,
        weddingDate: list.data.weddingDate,
        description: list.data.description,
        imageUrl: list.data.imageUrl,
        // só libera após pagamento
        pixType: list.paid ? list.data.pixType : '',
        pixKey: list.paid ? list.data.pixKey : ''
      }
    }

    return NextResponse.json({ ok: true, list: safe })
  } catch (err: any) {
    console.error('resolve error', err)
    return NextResponse.json({ error: 'Token inválido ou corrompido' }, { status: 400 })
  }
}
