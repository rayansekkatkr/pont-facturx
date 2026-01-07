import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

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
  const startedAt = Date.now();
  const requestId = `${startedAt}-${Math.random().toString(16).slice(2)}`;
  let target: string;
  try {
    target = buildUpstreamTarget(url, pathString);
  } catch (e: unknown) {
    console.error(
      `[pfxt-proxy ${requestId}] misconfigured path="/${pathString}" err=${e instanceof Error ? e.message : String(e)}`,
    );
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
  // Avoid content-decoding mismatches (browser sees gzip header but body is already decoded)
  headers.delete("accept-encoding");
  headers.delete("connection");
  headers.delete("content-length");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const r = await fetch(target, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method)
      ? undefined
      : await req.arrayBuffer(),
  });

  // Log the upstream call in Vercel logs to debug 404 vs 401 vs other issues.
  const elapsedMs = Date.now() - startedAt;
  const targetUrl = new URL(target);
  const tokenState = token ? "present" : "missing";

  if (r.status >= 400) {
    let errorPreview = "";
    try {
      const clone = r.clone();
      const contentType = clone.headers.get("content-type") || "";
      if (contentType.includes("application/json") || contentType.includes("text/")) {
        const txt = await clone.text();
        errorPreview = txt.slice(0, 500);
      }
    } catch {
      // ignore
    }

    console.warn(
      `[pfxt-proxy ${requestId}] ${req.method} /api/proxy/${pathString} -> ${targetUrl.origin}${targetUrl.pathname} status=${r.status} ms=${elapsedMs} token=${tokenState} body=${JSON.stringify(errorPreview)}`,
    );
  } else {
    console.info(
      `[pfxt-proxy ${requestId}] ${req.method} /api/proxy/${pathString} -> ${targetUrl.origin}${targetUrl.pathname} status=${r.status} ms=${elapsedMs} token=${tokenState}`,
    );
  }

  const upstreamEncoding = r.headers.get("content-encoding") || "none";

  const outHeaders = new Headers();
  for (const [key, value] of r.headers.entries()) {
    const k = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(k)) continue;
    if (k === "content-encoding") continue;
    if (k === "content-length") continue;
    outHeaders.append(key, value);
  }

  outHeaders.set("x-pfxt-proxy-version", "2026-01-06");
  outHeaders.set("x-pfxt-upstream-content-encoding", upstreamEncoding);
  outHeaders.set("cache-control", "no-store");
  outHeaders.set("content-encoding", "identity");

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
