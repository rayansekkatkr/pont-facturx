import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handler(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const token = (await cookies()).get("pfxt_token")?.value;
  const url = new URL(req.url);
  const { path } = await ctx.params;
  const pathString = path.join("/");
  const target = `${process.env.BACKEND_URL}/${pathString}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");
  // Avoid compression/header mismatches when proxying through Node fetch.
  headers.delete("accept-encoding");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const r = await fetch(target, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method)
      ? undefined
      : await req.arrayBuffer(),
  });

  const outHeaders = new Headers(r.headers);
  // Node fetch may transparently decode compressed bodies; don't forward encoding/length headers.
  outHeaders.delete("content-encoding");
  outHeaders.delete("content-length");
  outHeaders.delete("transfer-encoding");

  return new Response(await r.arrayBuffer(), {
    status: r.status,
    headers: outHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
