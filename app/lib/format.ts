
export function formatBRL(value: number) {
  try {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  } catch {
    return `R$ ${value}`
  }
}

export function formatDatePtBR(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}
