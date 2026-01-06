import { NextResponse } from "next/server";

import { cookieDomainForHost } from "@/lib/cookie-domain";

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const backend = process.env.BACKEND_URL;

  if (!backend) {
    return NextResponse.json(
      { detail: "BACKEND_URL manquant" },
      { status: 500 },
    );
  }

  const r = await fetch(`${backend}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await r.text();
  const json = safeJson(text);

  if (!r.ok) {
    return NextResponse.json(
      json ?? { detail: text || "Erreur login backend" },
      { status: r.status },
    );
  }

  const res = NextResponse.json(
    json ?? { detail: "Réponse backend invalide", raw: text },
  );

  const accessToken = (json as any)?.access_token;
  if (typeof accessToken === "string" && accessToken.length > 0) {
    const isProd = process.env.NODE_ENV === "production";
    const domain = isProd ? cookieDomainForHost(new URL(req.url).hostname) : undefined;
    res.cookies.set("pfxt_token", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      ...(domain ? { domain } : {}),
    });
    res.cookies.set("pfxt_last", String(Date.now()), {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      ...(domain ? { domain } : {}),
    });
  }

  return res;
}
