import { redirect } from "next/navigation";

import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(session_id);

  // If the user lands here before completion, send them back.
  if (session.status === "open") {
    redirect("/");
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold">Paiement confirmé</h1>
      <p className="mt-4 text-muted-foreground">
        Merci. Vous pouvez retourner sur le tableau de bord.
      </p>
      <a className="mt-6 inline-block underline" href="/dashboard">
        Aller au dashboard
      </a>
    </main>
  );
}
