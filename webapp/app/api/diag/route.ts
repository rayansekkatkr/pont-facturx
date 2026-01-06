export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return new Response(
    JSON.stringify(
      {
        ok: true,
        service: "webapp",
        version: "2026-01-06",
        now: new Date().toISOString(),
      },
      null,
      2,
    ),
    {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        "x-pfxt-proxy-version": "2026-01-06",
        "content-encoding": "identity",
      },
    },
  );
}
