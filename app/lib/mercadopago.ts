type PreferenceInput = {
  title: string
  price: number
  backUrls: { success: string; pending: string; failure: string }
  notificationUrl?: string
  externalReference?: string
  metadata?: any
}

function mpToken() {
  const t = process.env.MP_ACCESS_TOKEN
  if (!t) throw new Error('MP_ACCESS_TOKEN não configurado')
  return t
}

export async function createPreference(input: PreferenceInput) {
  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${mpToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [
        {
          title: input.title,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: input.price
        }
      ],
      back_urls: input.backUrls,
      auto_return: 'approved',
      notification_url: input.notificationUrl,
      external_reference: input.externalReference,
      metadata: input.metadata
    })
  })

  if (!res.ok) {
    const t = await res.text()
    throw new Error(`MercadoPago error: ${res.status} ${t}`)
  }
  return res.json()
}

export async function getPayment(paymentId: string) {
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${mpToken()}` }
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`MP payment error: ${res.status} ${t}`)
  }
  return res.json()
}
