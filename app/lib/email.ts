import nodemailer from 'nodemailer'

function required(name: string) {
  const v = process.env[name]
  if (!v) throw new Error(`Env ${name} não configurada`)
  return v
}

export async function sendEmail(opts: { to: string | string[]; subject: string; html: string }) {
  // Se não tiver SMTP configurado, não quebra o app em dev.
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM

  if (!host || !port || !user || !pass || !from) {
    console.warn('[email] SMTP não configurado - e-mail ignorado.')
    return { ok: false, skipped: true }
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass }
  })

  await transporter.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html
  })

  return { ok: true }
}

export function adminEmail() {
  return process.env.ADMIN_EMAIL || process.env.SMTP_FROM || ''
}

export function notifyEmails(): string[] {
  const raw = process.env.NOTIFY_EMAILS || process.env.ADMIN_EMAIL || ''
  const list = raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  // fallback útil para dev (manda para o mesmo "from")
  if (list.length === 0 && process.env.SMTP_FROM) list.push(process.env.SMTP_FROM)

  return Array.from(new Set(list))
}
