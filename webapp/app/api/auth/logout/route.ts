import { NextResponse } from "next/server";

import { cookieDomainForHost } from "@/lib/cookie-domain";

export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true });
  const isProd = process.env.NODE_ENV === "production";
  const domain = isProd ? cookieDomainForHost(new URL(req.url).hostname) : undefined;

  // Clear both host-only and explicit-domain cookies.
  // This handles the migration to shared cookies across apex/www.
  for (const name of ["pfxt_token", "pfxt_last"] as const) {
    res.cookies.set(name, "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });
    if (domain) {
      res.cookies.set(name, "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        domain,
      });
    }
  }
  return res;
}
