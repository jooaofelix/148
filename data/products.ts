import { Product } from "@/lib/types";

/**
 * Pre-launch catalog. Every piece is `status: "em-breve"` — no prices,
 * no stock, no sizes exposed. Images point at /public/images/products/
 * placeholders until official assets are supplied; see that folder's
 * README for the exact filenames each product expects.
 */
export const products: Product[] = [
  {
    slug: "148-001-essencial",
    name: "148 / 001",
    code: "148 / 001",
    line: "001",
    status: "em-breve",
    tagline: "A forma mais simples da marca.",
    story:
      "Uma peça, um símbolo, um nome. Sem ruído — só o essencial que sustenta tudo o que a 148 vai construir depois.",
    composition: "100% algodão penteado",
    fit: "Oversized",
    weight: "220g/m²",
    images: {
      front: "/images/products/148-001-essencial-front.webp",
      back: "/images/products/148-001-essencial-back.webp",
      details: ["/images/products/148-001-essencial-detail.webp"],
    },
    featured: true,
  },
  {
    slug: "bom-pastor",
    name: "Bom Pastor",
    code: "148 / ART",
    line: "art",
    status: "em-breve",
    tagline: "Ele conhece as Suas ovelhas.",
    story:
      "Uma arte sobre presença. Sobre alguém que fica quando seria mais fácil ir embora.",
    reference: { citation: "João 10:11" },
    composition: "100% algodão penteado",
    fit: "Oversized",
    weight: "220g/m²",
    images: {
      front: "/images/products/bom-pastor-front.webp",
      back: "/images/products/bom-pastor-back.webp",
    },
    featured: true,
  },
  {
    slug: "bread-of-life",
    name: "Bread of Life",
    code: "148 / ART",
    line: "art",
    status: "em-breve",
    tagline: "O que sacia de verdade.",
    story:
      "Sobre fome que comida nenhuma resolve — e sobre o único pão que sustenta de verdade.",
    reference: { citation: "João 6:35" },
    composition: "100% algodão penteado",
    fit: "Oversized",
    weight: "220g/m²",
    images: {
      front: "/images/products/bread-of-life-front.webp",
      back: "/images/products/bread-of-life-back.webp",
    },
  },
  {
    slug: "exodo-13-21",
    name: "Êxodo 13:21",
    code: "148 / ART",
    line: "art",
    status: "em-breve",
    tagline: "Coluna de fogo, coluna de nuvem.",
    story:
      "Sobre ser guiado no deserto — de dia por sombra, de noite por luz. Sobre nunca andar sozinho.",
    reference: { citation: "Êxodo 13:21" },
    composition: "100% algodão penteado",
    fit: "Oversized",
    weight: "220g/m²",
    images: {
      front: "/images/products/exodo-13-21-front.webp",
      back: "/images/products/exodo-13-21-back.webp",
      details: [
        "/images/products/exodo-13-21-offwhite-front.webp",
        "/images/products/exodo-13-21-offwhite-back.webp",
      ],
    },
  },
  {
    slug: "ele-supre",
    name: "Ele Supre",
    code: "148 / ART",
    line: "art",
    status: "em-breve",
    tagline: "Nada vai faltar.",
    story:
      "Sobre uma multiplicação que não faz sentido na conta — e sobre um Deus que nunca chega tarde na provisão.",
    reference: { citation: "João 6:11" },
    composition: "100% algodão penteado",
    fit: "Oversized",
    weight: "220g/m²",
    images: {
      front: "/images/products/ele-supre-front.webp",
      back: "/images/products/ele-supre-back.webp",
    },
  },
  {
    slug: "pescadores-de-homens",
    name: "Pescadores de Homens",
    code: "148 / ART",
    line: "art",
    status: "em-breve",
    tagline: "Vinde após mim.",
    story:
      "Sobre um chamado que muda o que você pesca. Sobre largar a rede de uma vida pra seguir outra.",
    reference: { citation: "Mateus 4:19" },
    composition: "100% algodão penteado",
    fit: "Oversized",
    weight: "220g/m²",
    images: {
      front: "/images/products/pescadores-de-homens-front.webp",
      back: "/images/products/pescadores-de-homens-back.webp",
    },
  },
  {
    slug: "fruto-do-espirito",
    name: "Fruto do Espírito",
    code: "148 / ART",
    line: "art",
    status: "em-breve",
    tagline: "O que cresce quando Ele fica.",
    story:
      "Amor, alegria, paz, paciência, bondade, fidelidade, mansidão, domínio próprio. Não se força — se cultiva.",
    reference: { citation: "Gálatas 5:22-23" },
    composition: "100% algodão penteado",
    fit: "Oversized",
    weight: "220g/m²",
    images: {
      front: "/images/products/fruto-do-espirito-front.webp",
      back: "/images/products/fruto-do-espirito-back.webp",
    },
  },
  {
    slug: "by-his-wounds",
    name: "By His Wounds",
    code: "148 / ART",
    line: "art",
    status: "em-breve",
    tagline: "We are healed.",
    story:
      "Sobre uma ferida que não se fecha sozinha. Sobre uma cura que custou a Dele.",
    reference: { citation: "Isaías 53:5" },
    composition: "100% algodão penteado",
    fit: "Oversized",
    weight: "220g/m²",
    images: {
      front: "/images/products/by-his-wounds-front.webp",
      back: "/images/products/by-his-wounds-back.webp",
      details: [
        "/images/products/by-his-wounds-brown-front.webp",
        "/images/products/by-his-wounds-grey-front.webp",
        "/images/products/by-his-wounds-offwhite-front.webp",
      ],
    },
  },
  {
    slug: "old-men",
    name: "Old Men",
    code: "148 / ART",
    line: "art",
    status: "em-breve",
    tagline: "O velho morreu. Quem vive agora não sou mais eu.",
    story:
      "Sobre enterrar quem você era. Sobre uma vida que só existe porque a antiga foi crucificada primeiro.",
    reference: { citation: "Gálatas 2:20" },
    composition: "100% algodão penteado",
    fit: "Oversized",
    weight: "220g/m²",
    images: {
      front: "/images/products/old-men-front.webp",
      back: "/images/products/old-men-back.webp",
    },
  },
  {
    slug: "ouvir-e-obedecer",
    name: "Ouvir e Obedecer",
    code: "148 / ART",
    line: "art",
    status: "em-breve",
    tagline: "Antes da chuva, a obediência.",
    story:
      "Sobre construir algo que não faz sentido pra ninguém — só pra quem ouviu a ordem antes da tempestade chegar.",
    reference: { citation: "Gênesis 6:22" },
    composition: "100% algodão penteado",
    fit: "Oversized",
    weight: "220g/m²",
    images: {
      front: "/images/products/ouvir-e-obedecer-front.webp",
      back: "/images/products/ouvir-e-obedecer-back.webp",
    },
  },
  {
    slug: "worthy-is-the-lamb",
    name: "Worthy Is the Lamb",
    code: "148 / ART",
    line: "art",
    status: "em-breve",
    tagline: "Digno é o Cordeiro.",
    story:
      "Sobre o único digno de abrir o que ninguém mais podia. Força que não se parece em nada com o que o mundo chama de força.",
    reference: { citation: "Apocalipse 5:6" },
    composition: "100% algodão penteado",
    fit: "Oversized",
    weight: "220g/m²",
    images: {
      front: "/images/products/worthy-is-the-lamb-front.webp",
      back: "/images/products/worthy-is-the-lamb-back.webp",
    },
  },
  {
    slug: "rios-de-misericordia",
    name: "Rios de Misericórdia",
    code: "148 / ART",
    line: "art",
    status: "em-breve",
    tagline: "Novas a cada manhã.",
    story:
      "Sobre recomeço. Sobre uma misericórdia que não se esgota, por mais fundo que o poço pareça.",
    reference: { citation: "Lamentações 3:22-23" },
    composition: "100% algodão penteado",
    fit: "Oversized",
    weight: "220g/m²",
    images: {
      front: "/images/products/rios-de-misericordia-front.webp",
      back: "/images/products/rios-de-misericordia-back.webp",
    },
  },
  {
    slug: "romanos-16-20",
    name: "Romanos 16:20",
    code: "148 / ART",
    line: "art",
    status: "em-breve",
    tagline: "Debaixo dos seus pés.",
    story:
      "Sobre uma guerra que já tem vencedor. Sobre paz que esmaga o que tentou te derrubar.",
    reference: { citation: "Romanos 16:20" },
    composition: "100% algodão penteado",
    fit: "Oversized",
    weight: "220g/m²",
    images: {
      front: "/images/products/romanos-16-20-front.webp",
      back: "/images/products/romanos-16-20-back.webp",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByLine(line: Product["line"]): Product[] {
  return products.filter((p) => p.line === line);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
