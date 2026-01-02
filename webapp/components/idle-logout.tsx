"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const IDLE_MS = 30 * 60 * 1000;
const PING_THROTTLE_MS = 60 * 1000;

export default function IdleLogout() {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<number | null>(null);
  const lastPingRef = useRef<number>(0);

  useEffect(() => {
    // Only enforce idle logout on protected pages.
    if (pathname === "/" || pathname.startsWith("/auth")) return;

    async function logoutAndRedirect() {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // ignore
      } finally {
        router.replace("/");
      }
    }

    function resetTimer() {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(logoutAndRedirect, IDLE_MS);

      const now = Date.now();
      if (now - lastPingRef.current > PING_THROTTLE_MS) {
        lastPingRef.current = now;
        fetch("/api/auth/ping", { method: "POST" }).catch(() => {});
      }
    }

    const events: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    for (const ev of events) {
      window.addEventListener(ev, resetTimer, { passive: true });
    }

    resetTimer();

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      for (const ev of events) {
        window.removeEventListener(ev, resetTimer);
      }
    };
  }, [pathname, router]);

  return null;
}
