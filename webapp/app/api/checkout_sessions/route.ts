import { NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  const subPriceMap: Record<string, string | undefined> = {
    starter: env.STRIPE_PRICE_SUB_STARTER,
    starter_annual: env.STRIPE_PRICE_SUB_STARTER_ANNUAL,
    pro: env.STRIPE_PRICE_SUB_PRO,
    pro_annual: env.STRIPE_PRICE_SUB_PRO_ANNUAL,
    business: env.STRIPE_PRICE_SUB_BUSINESS,
    business_annual: env.STRIPE_PRICE_SUB_BUSINESS_ANNUAL,
  };

  const raw = subPriceMap[sku];
  if (raw) return raw.trim() || null;
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
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: kind === "pack" ? "payment" : "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ checkout_url: session.url, session_id: session.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    const key = (process.env.STRIPE_SECRET_KEY || "").trim();
    const keyMode = key.startsWith("sk_test_") ? "test" : key.startsWith("sk_live_") ? "live" : "unknown";
    const hint = message.includes("No such price")
      ? `Price introuvable. Vérifie que le Price ID (${priceId}) existe dans le même compte Stripe et dans le même mode (${keyMode}) que ta STRIPE_SECRET_KEY.`
      : undefined;

    return NextResponse.json(
      {
        detail: "Stripe checkout session failed",
        message,
        hint,
      },
      { status: 500 },
    );
  }
}
