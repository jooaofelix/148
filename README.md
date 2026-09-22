# 148

Site oficial de pré-lançamento da 148 — marca de streetwear cristão contemporâneo, nascida do
Salmo 148 (*"Toda a criação louva"*). Next.js (App Router) + TypeScript + Tailwind CSS v4.

Este é o site de **pré-lançamento**: sem preços, sem checkout, sem estoque. O objetivo é
apresentar a marca, mostrar as primeiras linhas (`148 / 001` e `148 / ART`) e construir uma fila
de espera real para o primeiro drop.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Copie `.env.example` para `.env.local` e preencha o que for usar (analytics, `/admin`):

```bash
cp .env.example .env.local
```

## Estrutura

```
app/                  rotas (App Router) — home, /drop, /001, /art, /produto/[slug],
                       /manifesto, /fila, /privacidade, /termos, /admin, API routes
components/            componentes reutilizáveis (Header, Hero, ProductCard, WaitlistForm...)
data/                  dados do site: produtos, coleções, config (nenhum preço/estoque real)
lib/                   validação, storage da waitlist, analytics, rate limit, admin auth
public/images/         placeholders de imagem — troque pelos arquivos oficiais (ver READMEs
                       dentro de public/images/products e public/images/hero)
```

## Fila de espera (waitlist)

`POST /api/waitlist` salva os leads num arquivo (`.data/waitlist.json`, fora do git) através de
`lib/waitlist-store.ts`, que expõe uma interface `WaitlistStore` simples (`add`, `list`, `count`).
Isso mantém a fila **real** desde já, sem depender de infraestrutura externa.

Validação server-side, checagem de LGPD (`consent` obrigatório), honeypot + tempo mínimo de
preenchimento contra spam, rate limiting por IP e deduplicação por e-mail já estão implementados
(ver `lib/validation.ts`, `lib/rate-limit.ts`, `lib/waitlist-store.ts`).

Ao migrar para Cloudflare (Workers/Pages), troque `FileWaitlistStore` por uma implementação
sobre D1 ou KV que satisfaça a mesma interface `WaitlistStore` — nenhum outro código muda.

## `/admin`

Painel simples e não-indexado (`robots: noindex`) com estatísticas da fila (total, últimas 24h,
tamanhos, produtos mais desejados, origem) e exportação em CSV. Protegido por senha via cookie
assinado (HMAC) — configure `ADMIN_PASSWORD` e `ADMIN_SECRET` no `.env.local`.

## Imagens

Nenhuma arte, logo ou fotografia oficial foi inventada. Enquanto os arquivos reais não chegam, o
componente `PlaceholderImage` renderiza um placeholder identificado na proporção correta. Veja
`public/images/products/README.md` e `public/images/hero/README.md` para os nomes de arquivo
esperados por `data/products.ts`.

## Analytics

`lib/analytics.ts` expõe `track(event, params)`, que envia para `dataLayer`/`gtag` (GA4) e `fbq`
(Meta Pixel) quando os IDs (`NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`) estiverem
configurados — sem eles, os eventos só ficam no `dataLayer` local, sem erros.

## Deploy

Projeto Next.js padrão — funciona em qualquer host Node (Vercel, etc).

### Cloudflare (Workers, via OpenNext)

O repo já vem preparado com [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare)
(`wrangler.jsonc`, `open-next.config.ts`, scripts `cf:build` / `cf:preview` / `cf:deploy`).

```bash
npm run cf:build     # builda o Next.js e gera o bundle do Worker em .open-next/
npm run cf:preview   # testa o build localmente com o runtime da Cloudflare (Miniflare)
npm run cf:deploy    # builda e publica via wrangler
```

Se o projeto estiver conectado ao GitHub direto no painel da Cloudflare (Workers & Pages →
Import a repository), configure:

- **Build command**: `npm run cf:build`
- **Deploy command**: `npx wrangler deploy`

Variáveis de ambiente a configurar no painel (Settings → Variables), iguais ao `.env.example`:
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `ADMIN_PASSWORD`,
`ADMIN_SECRET`.

**Importante — fila de espera na Cloudflare:** Workers não tem sistema de arquivos, então
`lib/waitlist-store.ts` detecta automaticamente o runtime da Cloudflare e usa um armazenamento
**em memória** nesse caso (só para o build/preview não quebrar) — os cadastros **não persistem**
entre deploys ou instâncias. Antes de divulgar o link de verdade, troque
`InMemoryWaitlistStore` por uma implementação com Cloudflare D1 ou KV (a interface
`WaitlistStore` já está pronta para isso, nenhum outro código muda).
