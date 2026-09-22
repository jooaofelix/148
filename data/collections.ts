import { Collection } from "@/lib/types";

export const collections: Record<Collection["slug"], Collection> = {
  "001": {
    slug: "001",
    name: "148 / 001",
    title: "Linha 001",
    description:
      "A forma mais simples da marca. Essencial, limpa, reconhecível — a peça que carrega a 148 sem levantar a voz.",
    status: "em-breve",
    // Reaproveita a foto real da 001 até termos um editorial dedicado da coleção.
    cover: "/images/products/148-001-essencial-front.webp",
  },
  art: {
    slug: "art",
    name: "148 / ART",
    title: "Linha Art",
    description:
      "Arte que carrega uma mensagem. Símbolos, ilustração bíblica e referência — para quem olha duas vezes.",
    status: "em-breve",
    cover: "/images/collections/art-cover.webp",
  },
};

export const collectionList = Object.values(collections);
