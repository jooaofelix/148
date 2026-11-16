import type { Product } from "@/lib/types";

/** Contorno da peça dentro da foto recortada, em frações (0–1) da imagem. */
export interface GarmentBox {
  /** proporção natural da imagem (largura / altura) */
  aspect: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Enquadramento padrão das fotos recortadas da 148 (média dos arquivos atuais),
 * usado até a imagem carregar e ser medida de verdade.
 */
export const DEFAULT_BOX: GarmentBox = { aspect: 0.66, left: 0.01, top: 0.12, right: 0.99, bottom: 0.88 };

/**
 * Qual foto vai para o varal: o recorte sem fundo (pasta /cutout) da face com
 * a arte principal — costas quando existem, senão a frente. Para trocar a foto
 * de uma peça, substitua o arquivo em public/images/products/cutout/ com o
 * mesmo nome; o encaixe no cabide é medido sozinho.
 */
export function hangingImage(product: Product): string {
  const src = product.images.back ?? product.images.front;
  return src.replace("/images/products/", "/images/products/cutout/");
}

/**
 * Mede onde a camiseta está dentro da foto (pixels não transparentes), numa
 * cópia reduzida da imagem. Roda uma vez por foto, no carregamento.
 */
export function measureGarment(img: HTMLImageElement): GarmentBox | null {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh) return null;
  const h = 96;
  const w = Math.max(8, Math.round((h * nw) / nh));
  try {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (data[(y * w + x) * 4 + 3] > 40) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    if (x1 < 0) return null;
    // imagem sem transparência (foto comum): usa a imagem inteira
    if (x0 === 0 && y0 === 0 && x1 === w - 1 && y1 === h - 1) {
      return { aspect: nw / nh, left: 0, top: 0, right: 1, bottom: 1 };
    }
    return { aspect: nw / nh, left: x0 / w, top: y0 / h, right: (x1 + 1) / w, bottom: (y1 + 1) / h };
  } catch {
    return null;
  }
}

/** "Em breve" / "Disponível" / "Esgotado" */
export function statusLabel(status: Product["status"]): string {
  return status === "disponivel" ? "Disponível" : status === "esgotado" ? "Esgotado" : "Em breve";
}

/** Preço só aparece quando a peça está à venda e tem preço cadastrado. */
export function priceLabel(product: Product): string | null {
  if (product.status !== "disponivel" || !product.priceCents) return null;
  return (product.priceCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
