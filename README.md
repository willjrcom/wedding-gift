# Pix Casamento (Next.js + Tailwind + Backend)

Agora o projeto roda com **Next.js como backend** (SSR + API Routes), permitindo:

- Link criptografado: `?t=...` (AES-256-GCM) — não expõe dados na URL
- Persistência simples em arquivo (`lists.json`) em um volume (`DATA_DIR`)
- Checkout com **Mercado Pago** para liberar Pix (pagamento único)
- Envio de e-mails quando a lista é criada (free) e quando o Pix é ativado (pagamento aprovado)
- Página de **Dúvidas** em `/duvidas`

## Rodar local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variáveis de ambiente

Veja `.env.example`.

## Persistência

Este projeto **exige** um volume montado para persistir as listas.

- Monte um volume no container em `/data`
- Defina `DATA_DIR=/data`

Se o volume não estiver montado, a API retorna erro (para evitar “perder” dados ao reiniciar).

## Deploy (Docker)

```bash
docker build -t pix-casamento .
docker run -p 3000:3000 --env-file .env.local pix-casamento
```

> No Dokploy/Traefik, exponha a porta **3000**.

