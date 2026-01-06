import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { cookieDomainForHost } from "@/lib/cookie-domain";

export async function POST(req: Request) {
  const token = (await cookies()).get("pfxt_token")?.value;
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  const isProd = process.env.NODE_ENV === "production";
  const domain = isProd ? cookieDomainForHost(new URL(req.url).hostname) : undefined;

  res.cookies.set("pfxt_last", String(Date.now()), {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    ...(domain ? { domain } : {}),
  });

  return res;
}
