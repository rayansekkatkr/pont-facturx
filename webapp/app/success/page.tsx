import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function extractSessionId(searchParams?: PageProps["searchParams"]): string {
  const raw = searchParams?.session_id;
  const sessionId = Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
  return String(sessionId || "").trim();
}

async function syncSessionServerSide(sessionId: string) {
  const token = (await cookies()).get("pfxt_token")?.value;
  if (!token) redirect("/auth");

  const backend = (
    process.env.BACKEND_URL ||
    process.env.BACKEND_ORIGIN ||
    "http://localhost:8000"
  ).replace(/\/+$/, "");

  const res = await fetch(`${backend}/v1/billing/sync-session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session_id: sessionId }),
    cache: "no-store",
  });

  if (res.status === 401) redirect("/auth");

  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  // Diagnostic logs (server-side, Vercel functions). Do not log tokens.
  console.log("[success] billing sync-session", {
    backend,
    sessionIdPrefix: sessionId.slice(0, 12),
    status: res.status,
    ok: res.ok,
  });
  if (!res.ok) {
    const detail =
      body && typeof body === "object" && typeof (body as any).detail === "string"
        ? (body as any).detail
        : undefined;
    console.log("[success] billing sync-session failed", {
      status: res.status,
      detail,
    });
  }

  return { ok: res.ok, status: res.status, body };
}

function getDetail(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const rec = value as Record<string, unknown>;
  const detail = rec.detail;
  const message = rec.message;
  if (typeof detail === "string" && detail.trim()) return detail;
  if (typeof message === "string" && message.trim()) return message;
  return undefined;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const sessionId = extractSessionId(searchParams);
  if (!sessionId) redirect("/");

  const result = await syncSessionServerSide(sessionId);
  if (result.ok) redirect("/dashboard?checkout=success");

  const detail = getDetail(result.body);
  const message =
    typeof detail === "string" && detail.trim()
      ? detail
      : `Erreur de synchronisation (HTTP ${result.status})`;

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold">Finalisation du paiement…</h1>
      <p className="mt-4 text-muted-foreground">
        Impossible de mettre à jour votre compte automatiquement.
      </p>
      <div className="mt-6">
        <p className="text-sm text-destructive">{message}</p>
        <a className="mt-4 inline-block underline" href="/dashboard">
          Aller au dashboard
        </a>
      </div>
    </main>
  );
}
