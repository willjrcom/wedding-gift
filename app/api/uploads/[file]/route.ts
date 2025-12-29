import { NextResponse } from 'next/server'
import path from 'path'
import { createReadStream, promises as fs } from 'fs'
import { Readable } from 'stream'

import { ensureDataDir, getDataDir } from '@/app/lib/store'

export const runtime = 'nodejs'

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ file: string }> }
) {
  await ensureDataDir()

  const { file } = await ctx.params
  const name = file || ''
  // Basic traversal guard
  if (!name || name.includes('..') || name.includes('/') || name.includes('\\')) {
    return new NextResponse('Not found', { status: 404 })
  }

  const filePath = path.join(getDataDir(), 'uploads', name)

  try {
    await fs.access(filePath)
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }

  const stat = await fs.stat(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const type = CONTENT_TYPES[ext] || 'application/octet-stream'

  const nodeStream = createReadStream(filePath)
  const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream

  return new NextResponse(webStream, {
    headers: {
      'Content-Type': type,
      'Content-Length': String(stat.size),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
