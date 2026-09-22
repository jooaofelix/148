import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, checkAdminPassword, createAdminSession } from "@/lib/admin-auth";
import { isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const key =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "admin-login";
  if (isRateLimited(`admin-login:${key}`)) {
    return NextResponse.json({ ok: false, error: "Muitas tentativas." }, { status: 429 });
  }

  const form = await req.formData().catch(() => null);
  const password = form?.get("password");

  if (typeof password !== "string" || !checkAdminPassword(password)) {
    return NextResponse.redirect(new URL("/admin?error=1", req.url), { status: 303 });
  }

  const res = NextResponse.redirect(new URL("/admin", req.url), { status: 303 });
  res.cookies.set(ADMIN_COOKIE, createAdminSession(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
