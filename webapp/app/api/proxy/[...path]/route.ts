import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const token = (await cookies()).get("pfxt_token")?.value;
  const url = new URL(req.url);
  const { path } = await ctx.params;
  const pathString = path.join("/");
  const target = `${process.env.BACKEND_URL}/${pathString}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const r = await fetch(target, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer(),
  });

  return new Response(await r.arrayBuffer(), {
    status: r.status,
    headers: r.headers,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
