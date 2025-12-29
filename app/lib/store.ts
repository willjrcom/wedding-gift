import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

export type ListData = {
  coupleName: string
  weddingDate: string
  description: string
  pixType: string
  pixKey: string
  imageUrl: string
  email: string
}

export type StoredList = {
  id: string
  createdAt: string
  paid: boolean
  data: ListData
}

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), '.data')
const FILE = path.join(DATA_DIR, 'lists.json')

async function ensure() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(FILE)
  } catch {
    await fs.writeFile(FILE, JSON.stringify({ lists: [] }, null, 2), 'utf8')
  }
}

async function readAll(): Promise<{ lists: StoredList[] }> {
  await ensure()
  const raw = await fs.readFile(FILE, 'utf8')
  try {
    return JSON.parse(raw)
  } catch {
    // se corromper, recria
    return { lists: [] }
  }
}

async function writeAll(data: { lists: StoredList[] }) {
  await ensure()
  const tmp = FILE + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8')
  await fs.rename(tmp, FILE)
}

export function newId() {
  return crypto.randomBytes(9).toString('hex')
}

export async function createList(payload: ListData): Promise<StoredList> {
  const db = await readAll()
  const list: StoredList = {
    id: newId(),
    createdAt: new Date().toISOString(),
    paid: false,
    data: payload
  }
  db.lists.unshift(list)
  await writeAll(db)
  return list
}

export async function getList(id: string): Promise<StoredList | null> {
  const db = await readAll()
  return db.lists.find(l => l.id === id) || null
}

export async function markPaid(id: string) {
  const db = await readAll()
  const idx = db.lists.findIndex(l => l.id === id)
  if (idx === -1) return null

  // evita enviar e-mail duplicado caso o webhook/redirect chegue mais de uma vez
  if (db.lists[idx].paid) return null

  db.lists[idx].paid = true
  await writeAll(db)
  return db.lists[idx]
}
