import { Size, WaitlistInput } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Accepts Brazilian numbers with or without country code / formatting. */
const PHONE_DIGITS_RE = /^\d{10,13}$/;
const VALID_SIZES: Size[] = ["P", "M", "G", "GG", "XGG"];

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidatedWaitlistInput {
  name: string;
  email: string;
  phone: string;
  size?: Size;
  sourcePage: string;
  productInterest?: string;
  consent: true;
}

export function validateWaitlistInput(
  body: unknown
): { ok: true; data: ValidatedWaitlistInput } | { ok: false; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (typeof body !== "object" || body === null) {
    return { ok: false, errors: [{ field: "_", message: "Corpo inválido." }] };
  }

  const input = body as Partial<WaitlistInput> & Record<string, unknown>;

  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (name.length < 2 || name.length > 120) {
    errors.push({ field: "name", message: "Informe seu nome." });
  }

  const email = typeof input.email === "string" ? input.email.trim() : "";
  if (!EMAIL_RE.test(email) || email.length > 190) {
    errors.push({ field: "email", message: "Informe um e-mail válido." });
  }

  const phoneDigits =
    typeof input.phone === "string" ? input.phone.replace(/\D/g, "") : "";
  if (!PHONE_DIGITS_RE.test(phoneDigits)) {
    errors.push({ field: "phone", message: "Informe um WhatsApp válido com DDD." });
  }

  let size: Size | undefined;
  if (input.size) {
    if (typeof input.size === "string" && VALID_SIZES.includes(input.size as Size)) {
      size = input.size as Size;
    } else {
      errors.push({ field: "size", message: "Tamanho inválido." });
    }
  }

  if (input.consent !== true) {
    errors.push({
      field: "consent",
      message: "É necessário aceitar receber novidades sobre o lançamento.",
    });
  }

  const sourcePage =
    typeof input.sourcePage === "string" && input.sourcePage.length <= 200
      ? input.sourcePage
      : "/";

  const productInterest =
    typeof input.productInterest === "string" && input.productInterest.length <= 120
      ? input.productInterest
      : undefined;

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name,
      email: email.toLowerCase(),
      phone: phoneDigits,
      size,
      sourcePage,
      productInterest,
      consent: true,
    },
  };
}

/** Basic bot resistance: a filled honeypot, or a form submitted implausibly fast, is spam. */
export function looksLikeSpam(input: {
  website?: unknown;
  formRenderedAt?: unknown;
}): boolean {
  if (typeof input.website === "string" && input.website.trim().length > 0) {
    return true;
  }
  if (typeof input.formRenderedAt === "number") {
    const elapsed = Date.now() - input.formRenderedAt;
    if (elapsed >= 0 && elapsed < 1200) return true;
  }
  return false;
}
