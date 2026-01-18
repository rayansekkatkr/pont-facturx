import { NextRequest, NextResponse } from "next/server";

import { cookieDomainForHost } from "@/lib/cookie-domain";

const IDLE_MS = 30 * 60 * 1000;

function applyCoopHeaders(res: NextResponse) {
  // Allow OAuth/Stripe popup flows that use postMessage.
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  // Avoid cross-origin isolation requirements that can break third-party scripts.
  res.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");
  return res;
}

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/icon.svg" ||
    pathname.startsWith("/icon-") ||
    pathname === "/apple-icon.png"
  );
}

function isPublicPath(pathname: string) {
  if (pathname === "/") return true;
  if (pathname.startsWith("/auth")) return true;

  // Auth APIs must remain accessible to log in/out.
  if (pathname.startsWith("/api/auth/")) return true;

  return false;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProd = process.env.NODE_ENV === "production";
  const domain = isProd ? cookieDomainForHost(req.nextUrl.hostname) : undefined;

  // Pages protégées qui ne doivent pas être indexées par les moteurs de recherche
  const protectedPages = [
    '/auth',
    '/billing',
    '/dashboard',
    '/profile',
    '/results',
    '/upload',
    '/verify',
    '/verify-code',
    '/verify-email',
    '/success',
  ];

  if (isStaticAsset(pathname)) {
    return applyCoopHeaders(NextResponse.next());
  }

  // Never mutate cookies on auth endpoints.
  // This prevents cookie write races (e.g. /api/auth/logout).
  if (pathname.startsWith("/api/auth/")) {
    return applyCoopHeaders(NextResponse.next());
  }

  const token = req.cookies.get("pfxt_token")?.value;

  // Not logged in: allow only public paths.
  if (!token) {
    if (isPublicPath(pathname)) return applyCoopHeaders(NextResponse.next());

    // API calls: return 401 instead of redirecting.
    if (pathname.startsWith("/api/")) {
      return applyCoopHeaders(
        NextResponse.json({ detail: "Not authenticated" }, { status: 401 }),
      );
    }

    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return applyCoopHeaders(NextResponse.redirect(url));
  }

  // Logged in: enforce inactivity timeout (rolling).
  const now = Date.now();
  const lastRaw = req.cookies.get("pfxt_last")?.value;
  const last = lastRaw ? Number(lastRaw) : NaN;
  const expired = Number.isFinite(last) ? now - last > IDLE_MS : false;

  if (expired) {
    const opts = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: isProd,
      path: "/",
      ...(domain ? { domain } : {}),
    };

    if (pathname.startsWith("/api/")) {
      const res = NextResponse.json({ detail: "Session expired" }, { status: 401 });
      res.cookies.set("pfxt_token", "", { ...opts, maxAge: 0 });
      res.cookies.set("pfxt_last", "", { ...opts, maxAge: 0 });
      return applyCoopHeaders(res);
    }

    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";

    const res = NextResponse.redirect(url);
    res.cookies.set("pfxt_token", "", { ...opts, maxAge: 0 });
    res.cookies.set("pfxt_last", "", { ...opts, maxAge: 0 });
    return applyCoopHeaders(res);
  }

  // Refresh last activity timestamp.
  const res = NextResponse.next();
  
  // Ajouter noindex pour les pages protégées
  if (protectedPages.some(page => pathname.startsWith(page))) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  
  res.cookies.set("pfxt_last", String(now), {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
    ...(domain ? { domain } : {}),
  });
  return applyCoopHeaders(res);
}

export const config = {
  matcher: ["/:path*"],
};
