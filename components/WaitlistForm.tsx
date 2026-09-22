"use client";

import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Size } from "@/lib/types";
import { parseUtm } from "@/lib/utm";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { NewsletterConfirmation } from "./NewsletterConfirmation";

const SIZES: Size[] = ["P", "M", "G", "GG", "XGG"];

interface WaitlistFormProps {
  productInterest?: string;
  source?: string;
  className?: string;
  onSuccess?: () => void;
  /** "paper" (default) for the form's text on dark/ink backgrounds; "ink" for use on paper/light backgrounds. */
  tone?: "paper" | "ink";
}

type Status = "idle" | "submitting" | "success" | "error";

export function WaitlistForm(props: WaitlistFormProps) {
  return (
    <Suspense fallback={null}>
      <WaitlistFormInner {...props} />
    </Suspense>
  );
}

function WaitlistFormInner({
  productInterest,
  source = "site",
  className = "",
  onSuccess,
  tone = "paper",
}: WaitlistFormProps) {
  const t =
    tone === "paper"
      ? {
          label: "text-paper/60",
          input: "border-paper/25 bg-transparent text-paper placeholder:text-paper/30 focus:border-paper",
          chip: "border-paper/25 text-paper/70 has-[:checked]:border-paper has-[:checked]:bg-paper has-[:checked]:text-ink",
          consent: "text-paper/60",
          checkbox: "border-paper/40 accent-paper",
          error: "text-paper/80",
          button: "bg-paper text-ink",
        }
      : {
          label: "text-ink/60",
          input: "border-ink/25 bg-transparent text-ink placeholder:text-ink/30 focus:border-ink",
          chip: "border-ink/25 text-ink/70 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper",
          consent: "text-ink/60",
          checkbox: "border-ink/40 accent-ink",
          error: "text-ink/80",
          button: "bg-ink text-paper",
        };
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const renderedAt = useRef(0);
  const started = useRef(false);

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  function handleFocusStart() {
    if (started.current) return;
    started.current = true;
    track(ANALYTICS_EVENTS.waitlistFormStart, { productInterest, source });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      size: (formData.get("size") as Size) || undefined,
      consent: formData.get("consent") === "on",
      website: String(formData.get("website") ?? ""),
      formRenderedAt: renderedAt.current,
      sourcePage: pathname,
      productInterest,
      source,
      utm: parseUtm(searchParams),
    };

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMessage(
          data?.errors?.[0]?.message ?? data?.error ?? "Verifique os dados e tente novamente."
        );
        return;
      }

      setStatus("success");
      track(ANALYTICS_EVENTS.waitlistSignupComplete, { productInterest, source });
      onSuccess?.();
    } catch {
      setStatus("error");
      setErrorMessage("Falha de conexão. Tente novamente.");
    }
  }

  if (status === "success") {
    return <NewsletterConfirmation />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={handleFocusStart}
      noValidate
      className={`flex flex-col gap-4 ${className}`}
    >
      {/* Honeypot — hidden from real users, left empty by them, filled by most bots. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={`text-xs font-medium uppercase tracking-[0.15em] ${t.label}`}>
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Seu nome"
            className={`border px-4 py-3 ${t.input}`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className={`text-xs font-medium uppercase tracking-[0.15em] ${t.label}`}>
            WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="(00) 00000-0000"
            className={`border px-4 py-3 ${t.input}`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={`text-xs font-medium uppercase tracking-[0.15em] ${t.label}`}>
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          className={`border px-4 py-3 ${t.input}`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={`text-xs font-medium uppercase tracking-[0.15em] ${t.label}`}>
          Tamanho que você costuma usar (opcional)
        </span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Tamanho">
          {SIZES.map((size) => (
            <label
              key={size}
              className={`cursor-pointer border px-3.5 py-2 text-sm transition-colors ${t.chip}`}
            >
              <input type="radio" name="size" value={size} className="sr-only" />
              {size}
            </label>
          ))}
        </div>
      </div>

      <label className={`flex items-start gap-3 pt-1 text-xs leading-relaxed ${t.consent}`}>
        <input
          type="checkbox"
          name="consent"
          required
          className={`mt-0.5 h-4 w-4 shrink-0 border bg-transparent ${t.checkbox}`}
        />
        Quero receber novidades e informações sobre o lançamento da 148, de acordo com a
        política de privacidade.
      </label>

      {status === "error" && errorMessage && (
        <p role="alert" className={`text-sm ${t.error}`}>
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className={`mt-2 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-90 disabled:opacity-50 ${t.button}`}
      >
        {status === "submitting" ? "Enviando..." : "Entrar na fila"}
      </button>
    </form>
  );
}
