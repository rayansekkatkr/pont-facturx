import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildUpstreamTarget(reqUrl: URL, pathString: string): string {
  const backend = process.env.BACKEND_URL;
  if (!backend) {
    throw new Error("Missing BACKEND_URL");
  }

  const base = new URL(backend);
  let basePath = base.pathname.replace(/\/+$/, "");
  if (basePath === "/") basePath = "";

  let extraPath = `/${pathString.replace(/^\/+/, "")}`;

  // If BACKEND_URL already contains /v1, avoid generating /v1/v1/...
  if (basePath.endsWith("/v1") && extraPath.startsWith("/v1/")) {
    extraPath = extraPath.slice(3);
  }

  base.pathname = `${basePath}${extraPath}`;
  base.search = reqUrl.search;
  return base.toString();
}

async function handler(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const token = (await cookies()).get("pfxt_token")?.value;
  const url = new URL(req.url);
  const { path } = await ctx.params;
  const pathString = path.join("/");
  let target: string;
  try {
    target = buildUpstreamTarget(url, pathString);
  } catch (e: unknown) {
    return new Response(
      JSON.stringify({ detail: e instanceof Error ? e.message : "Proxy misconfigured" }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
        },
      },
    );
  }

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
