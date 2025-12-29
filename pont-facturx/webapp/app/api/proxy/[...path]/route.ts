import { cookies } from "next/headers";

async function handler(req: Request, ctx: { params: { path: string[] } }) {
  const token = (await cookies()).get("pfxt_token")?.value;
  const url = new URL(req.url);
  const path = ctx.params.path.join("/");
  const target = `${process.env.BACKEND_URL}/${path}${url.search}`;

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
