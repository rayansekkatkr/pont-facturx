import { NextResponse } from "next/server";

import { cookieDomainForHost } from "@/lib/cookie-domain";

export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true });
  const isProd = process.env.NODE_ENV === "production";
  const domain = isProd ? cookieDomainForHost(new URL(req.url).hostname) : undefined;

  res.cookies.set("pfxt_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    ...(domain ? { domain } : {}),
  });
  res.cookies.set("pfxt_last", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    ...(domain ? { domain } : {}),
  });
  return res;
}
