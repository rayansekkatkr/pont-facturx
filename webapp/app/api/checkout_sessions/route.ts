import { NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe";

type Body = {
  kind?: "pack" | "subscription";
  sku?: string;
};

function getOrigin(req: Request): string {
  // Prefer request origin; fallback for local dev.
  try {
    return new URL(req.url).origin;
  } catch {
    return "http://localhost:3000";
  }
}

function getPriceId(kind: "pack" | "subscription", sku: string): string | null {
  const env = process.env;
  if (kind === "pack") {
    if (sku === "pack_20") return (env.STRIPE_PRICE_PACK_20 || "").trim() || null;
    if (sku === "pack_100") return (env.STRIPE_PRICE_PACK_100 || "").trim() || null;
    if (sku === "pack_500") return (env.STRIPE_PRICE_PACK_500 || "").trim() || null;
    return null;
  }

  if (sku === "starter") return (env.STRIPE_PRICE_SUB_STARTER || "").trim() || null;
  if (sku === "pro") return (env.STRIPE_PRICE_SUB_PRO || "").trim() || null;
  if (sku === "business") return (env.STRIPE_PRICE_SUB_BUSINESS || "").trim() || null;
  return null;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ detail: "Corps JSON invalide" }, { status: 400 });
  }

  const kind = (body.kind || "").toLowerCase() as Body["kind"];
  const sku = (body.sku || "").toLowerCase();

  if (kind !== "pack" && kind !== "subscription") {
    return NextResponse.json({ detail: "kind invalide" }, { status: 400 });
  }
  if (!sku) {
    return NextResponse.json({ detail: "sku manquant" }, { status: 400 });
  }

  const priceId = getPriceId(kind, sku);
  if (!priceId) {
    return NextResponse.json(
      { detail: `Price ID Stripe manquant pour ${kind}:${sku}` },
      { status: 500 },
    );
  }

  const origin = getOrigin(req);
  const successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/?checkout=cancel`;

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: kind === "pack" ? "payment" : "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return NextResponse.json({ checkout_url: session.url, session_id: session.id });
}
