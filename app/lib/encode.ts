// Mantido só para compatibilidade com versões antigas.
// Agora o projeto usa token criptografado (?t=...) e resolve via backend.
export const encode = (_d: any) => ''
export const decode = (_t: string) => {
  throw new Error('Versão antiga. Gere um novo link.')
}
