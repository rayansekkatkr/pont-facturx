import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

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
  // Avoid content-decoding mismatches (browser sees gzip header but body is already decoded)
  headers.delete("accept-encoding");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const r = await fetch(target, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method)
      ? undefined
      : await req.arrayBuffer(),
  });

  const upstreamEncoding = r.headers.get("content-encoding") || "none";
  const outHeaders = new Headers(r.headers);
  outHeaders.delete("content-encoding");
  outHeaders.delete("content-length");
  outHeaders.delete("transfer-encoding");
  outHeaders.set("x-pfxt-proxy-version", "2026-01-06");
  outHeaders.set("x-pfxt-upstream-content-encoding", upstreamEncoding);

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
