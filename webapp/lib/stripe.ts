import "server-only";

import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  _stripe = new Stripe(key, {
    // Let Stripe SDK pick the supported default API version.
  });
  return _stripe;
}
