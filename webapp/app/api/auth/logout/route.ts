import { NextResponse } from "next/server";

import { cookieDomainForHost } from "@/lib/cookie-domain";

export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true });
  const isProd = process.env.NODE_ENV === "production";
  const hostname = new URL(req.url).hostname;
  const domain = isProd ? cookieDomainForHost(hostname) : undefined;
  const apexDomain = domain ? domain.replace(/^\./, "") : undefined;

  const baseOpts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
    maxAge: 0,
  };

  // Clear both host-only and explicit-domain cookies.
  // This handles the migration to shared cookies across apex/www.
  for (const name of ["pfxt_token", "pfxt_last"] as const) {
    res.cookies.set(name, "", baseOpts);
    if (domain) {
      res.cookies.set(name, "", { ...baseOpts, domain });
    }
    if (apexDomain) {
      res.cookies.set(name, "", { ...baseOpts, domain: apexDomain });
    }

    // Extra safety: clear cookies that may have been set with Domain=<current host>
    // (e.g. older deployments using Domain=www.pont-facturx.com).
    if (isProd && hostname) {
      res.cookies.set(name, "", { ...baseOpts, domain: hostname });
    }
  }
  return res;
}
