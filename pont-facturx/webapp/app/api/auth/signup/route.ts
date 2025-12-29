import { NextResponse } from "next/server";

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
      { detail: "BACKEND_URL manquant dans l'environnement Next.js" },
      { status: 500 }
    );
  }

  const r = await fetch(`${backend}/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await r.text();
  const json = safeJson(text);

  if (!r.ok) {
    // ✅ on renvoie une erreur JSON si possible, sinon texte brut
    return NextResponse.json(
      json ?? { detail: text || "Erreur signup backend" },
      { status: r.status }
    );
  }

  // ✅ réponse OK: JSON attendu, mais on sécurise quand même
  return NextResponse.json(json ?? { detail: "Réponse backend invalide", raw: text });
}
