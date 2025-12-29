import { NextResponse } from 'next/server'
import path from 'path'
import crypto from 'crypto'
import { promises as fs } from 'fs'

import { ensureDataDir, getDataDir } from '@/app/lib/store'

export const runtime = 'nodejs'

const MAX_BYTES = 8 * 1024 * 1024 // 8MB

export async function POST(req: Request) {
  await ensureDataDir()

  const form = await req.formData()
  const file = form.get('file')

  if (!file || typeof file === 'string' || !(file instanceof File)) {
    return NextResponse.json({ error: 'Envie um arquivo no campo "file".' }, { status: 400 })
  }

  if (!file.type?.startsWith('image/')) {
    return NextResponse.json({ error: 'Envie apenas imagens.' }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Imagem muito grande. Máximo 8MB.' }, { status: 400 })
  }

  const uploadsDir = path.join(getDataDir(), 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })

  const ext = (path.extname(file.name) || '').slice(0, 10)
  const filename = `${crypto.randomUUID()}${ext || '.png'}`
  const buf = Buffer.from(await file.arrayBuffer())

  await fs.writeFile(path.join(uploadsDir, filename), buf)

  return NextResponse.json({ url: `/api/uploads/${filename}` })
}
