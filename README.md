# Pix Casamento (Next.js + Tailwind + Backend)

Agora o projeto roda com **Next.js como backend** (SSR + API Routes), permitindo:

- Link criptografado: `?t=...` (AES-256-GCM) — não expõe dados na URL
- Persistência simples em arquivo (`.data/lists.json`)
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

Por padrão, salva em:

- `.data/lists.json`

Em produção, recomendo montar um volume no container e apontar:

- `DATA_DIR=/data`

## Deploy (Docker)

```bash
docker build -t pix-casamento .
docker run -p 3000:3000 --env-file .env.local pix-casamento
```

> No Dokploy/Traefik, exponha a porta **3000**.

