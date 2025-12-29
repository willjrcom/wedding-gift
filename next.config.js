/** @type {import('next').NextConfig} */
const nextConfig = {
  // Agora usamos Next como backend (SSR/API routes).
  // Isso permite Mercado Pago + e-mails + token criptografado.
  output: 'standalone'
}
module.exports = nextConfig
