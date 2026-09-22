import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { waitlistStore } from "@/lib/waitlist-store";

export const runtime = "nodejs";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
  }

  const entries = await waitlistStore.list();
  const header = [
    "id",
    "name",
    "email",
    "phone",
    "size",
    "createdAt",
    "source",
    "sourcePage",
    "productInterest",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "consent",
    "consentAt",
  ];

  const rows = entries.map((e) =>
    [
      e.id,
      e.name,
      e.email,
      e.phone,
      e.size ?? "",
      e.createdAt,
      e.source,
      e.sourcePage,
      e.productInterest ?? "",
      e.utm?.source ?? "",
      e.utm?.medium ?? "",
      e.utm?.campaign ?? "",
      String(e.consent),
      e.consentAt,
    ]
      .map((v) => csvEscape(String(v)))
      .join(",")
  );

  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="148-waitlist-${Date.now()}.csv"`,
    },
  });
}
