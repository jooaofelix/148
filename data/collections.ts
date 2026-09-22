import { Collection } from "@/lib/types";

export const collections: Record<Collection["slug"], Collection> = {
  "001": {
    slug: "001",
    name: "148 / 001",
    title: "Linha 001",
    description:
      "A forma mais simples da marca. Essencial, limpa, reconhecível — a peça que carrega a 148 sem levantar a voz.",
    status: "em-breve",
  },
  art: {
    slug: "art",
    name: "148 / ART",
    title: "Linha Art",
    description:
      "Arte que carrega uma mensagem. Símbolos, ilustração bíblica e referência — para quem olha duas vezes.",
    status: "em-breve",
  },
};

export const collectionList = Object.values(collections);
