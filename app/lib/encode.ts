
export const encode = (d: any) => encodeURIComponent(JSON.stringify(d))

export const decode = (t: string) => {
  try {
    return JSON.parse(decodeURIComponent(t))
  } catch {
    throw new Error('Link inválido ou antigo. Gere um novo link.')
  }
}
