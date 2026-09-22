/**
 * Core domain types for the 148 site.
 * Product/collection shapes are deliberately wider than what pre-launch
 * needs (sizes, price, stock) so the catalog/cart/checkout can be added
 * later without reshaping this layer.
 */

export type ProductLine = "001" | "art";

export type ProductStatus = "em-breve" | "disponivel" | "esgotado";

export type Size = "P" | "M" | "G" | "GG" | "XGG";

export interface BibleReference {
  /** e.g. "João 10:11" */
  citation: string;
  /** Short verse excerpt or paraphrase used on the product story. */
  verse?: string;
}

export interface ProductImages {
  front: string;
  back?: string;
  details?: string[];
}

export interface Product {
  slug: string;
  name: string;
  /** How the piece is labeled in-context, e.g. "148 / 001" */
  code: string;
  line: ProductLine;
  status: ProductStatus;
  tagline?: string;
  story?: string;
  reference?: BibleReference;
  composition?: string;
  fit?: string;
  weight?: string;
  images: ProductImages;
  sizes?: Size[];
  /** Price in cents. Not rendered anywhere pre-launch; reserved for the store phase. */
  priceCents?: number;
  featured?: boolean;
  /** Marks a piece as a premium/limited tier — shown as a badge, no price implied. */
  premium?: boolean;
}

export interface Collection {
  slug: ProductLine;
  name: string;
  title: string;
  description: string;
  status: ProductStatus;
  /** Cover photo path, e.g. "/images/collections/001-cover.webp". Falls back to a placeholder if missing. */
  cover: string;
}

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  size?: Size;
  createdAt: string;
  source: string;
  sourcePage: string;
  productInterest?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
  consent: boolean;
  consentAt: string;
}

export type WaitlistInput = Pick<
  WaitlistEntry,
  "name" | "email" | "phone" | "size" | "sourcePage" | "productInterest" | "consent"
> & {
  utm?: WaitlistEntry["utm"];
  /** Honeypot field; must arrive empty. */
  website?: string;
  /** Timestamp (ms) the form was rendered, used for a minimum-fill-time spam check. */
  formRenderedAt?: number;
};
