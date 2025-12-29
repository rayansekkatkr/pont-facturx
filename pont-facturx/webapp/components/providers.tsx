"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Providers({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error(
      "NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing. Check .env.local and restart Next dev server."
    );
    // On rend quand même l'app, mais GoogleLogin ne marchera pas.
    return <>{children}</>;
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
