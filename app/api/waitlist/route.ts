import { NextRequest, NextResponse } from "next/server";
import { looksLikeSpam, validateWaitlistInput } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import { waitlistStore } from "@/lib/waitlist-store";

export const runtime = "nodejs";

function getClientKey(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  if (isRateLimited(getClientKey(req))) {
    return NextResponse.json(
      { ok: false, error: "Muitas tentativas. Tente novamente em instantes." },
      { status: 429 }
    );
  }

  const record = body as Record<string, unknown>;
  if (looksLikeSpam({ website: record.website, formRenderedAt: record.formRenderedAt })) {
    // Respond as if it worked so bots don't learn anything from the response shape.
    return NextResponse.json({ ok: true, deduped: false });
  }

  const result = validateWaitlistInput(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });
  }

  const { data } = result;
  const utm =
    typeof record.utm === "object" && record.utm !== null
      ? (record.utm as Record<string, string>)
      : undefined;
  const source = typeof record.source === "string" ? record.source : "site";

  try {
    const { entry, deduped } = await waitlistStore.add({
      name: data.name,
      email: data.email,
      phone: data.phone,
      size: data.size,
      sourcePage: data.sourcePage,
      productInterest: data.productInterest,
      consent: data.consent,
      source,
      utm,
    });

    return NextResponse.json({ ok: true, id: entry.id, deduped });
  } catch (err) {
    console.error("waitlist:add failed", err);
    return NextResponse.json(
      { ok: false, error: "Não foi possível salvar agora. Tente novamente." },
      { status: 500 }
    );
  }
}
