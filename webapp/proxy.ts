import { NextRequest, NextResponse } from "next/server";

const IDLE_MS = 30 * 60 * 1000;

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

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
  };
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("pfxt_token")?.value;

  // Not logged in: allow only public paths.
  if (!token) {
    if (isPublicPath(pathname)) return NextResponse.next();

    // API calls: return 401 instead of redirecting.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Logged in: enforce inactivity timeout (rolling).
  const now = Date.now();
  const lastRaw = req.cookies.get("pfxt_last")?.value;
  const last = lastRaw ? Number(lastRaw) : NaN;
  const expired = Number.isFinite(last) ? now - last > IDLE_MS : false;

  if (expired) {
    const opts = cookieOptions();

    if (pathname.startsWith("/api/")) {
      const res = NextResponse.json({ detail: "Session expired" }, { status: 401 });
      res.cookies.set("pfxt_token", "", { ...opts, maxAge: 0 });
      res.cookies.set("pfxt_last", "", { ...opts, maxAge: 0 });
      return res;
    }

    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";

    const res = NextResponse.redirect(url);
    res.cookies.set("pfxt_token", "", { ...opts, maxAge: 0 });
    res.cookies.set("pfxt_last", "", { ...opts, maxAge: 0 });
    return res;
  }

  // Refresh last activity timestamp.
  const res = NextResponse.next();
  res.cookies.set("pfxt_last", String(now), cookieOptions());
  return res;
}

export const config = {
  matcher: ["/:path*"],
};
