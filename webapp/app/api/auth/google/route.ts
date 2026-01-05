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
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { detail: "Corps JSON invalide" },
      { status: 400 },
    );
  }

  // Google One Tap / GIS often posts { credential }, while backend expects { id_token }
  if (body && typeof body === "object" && !body.id_token && body.credential) {
    body = { ...body, id_token: body.credential };
    delete body.credential;
  }

  if (!body?.id_token || typeof body.id_token !== "string") {
    return NextResponse.json(
      { detail: "Champ 'id_token' manquant" },
      { status: 400 },
    );
  }
  const backend = process.env.BACKEND_URL;

  if (!backend) {
    return NextResponse.json(
      { detail: "BACKEND_URL manquant" },
      { status: 500 },
    );
  }

  let r: Response;
  try {
    r = await fetch(`${backend}/v1/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: body.id_token }),
      cache: "no-store",
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        detail: "Impossible de contacter le backend",
        backend,
        error: e?.message ?? String(e),
      },
      { status: 502 },
    );
  }

  const text = await r.text();
  const json = safeJson(text);

  if (!r.ok) {
    return NextResponse.json(
      json ?? { detail: text || "Erreur Google backend" },
      { status: r.status },
    );
  }

  const res = NextResponse.json(json ?? { detail: "Réponse backend invalide", raw: text });
  const isProd = process.env.NODE_ENV === "production";
  const domain = isProd ? cookieDomainForHost(new URL(req.url).hostname) : undefined;

  const accessToken = (json as any)?.access_token;
  if (typeof accessToken === "string" && accessToken.length > 0) {
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
