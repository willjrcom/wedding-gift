import crypto from 'crypto'

const SECRET = process.env.TOKEN_SECRET || ''

function getKey() {
  if (!SECRET || SECRET.length < 16) {
    throw new Error('TOKEN_SECRET não configurado (mínimo 16 chars).')
  }
  return crypto.scryptSync(SECRET, 'wedding-gift', 32)
}

function b64u(buf: Buffer) {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function unb64u(s: string) {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return Buffer.from(s, 'base64')
}

export function encryptToken(payload: any) {
  const key = getKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

  const plaintext = Buffer.from(JSON.stringify(payload), 'utf8')
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()])
  const tag = cipher.getAuthTag()

  return b64u(Buffer.concat([iv, tag, ciphertext]))
}

export function decryptToken(token: string) {
  const key = getKey()
  const raw = unb64u(token)
  const iv = raw.subarray(0, 12)
  const tag = raw.subarray(12, 28)
  const data = raw.subarray(28)

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)

  const plaintext = Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
  return JSON.parse(plaintext)
}
