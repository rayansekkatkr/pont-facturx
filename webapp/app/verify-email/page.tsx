"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error" | "already_verified">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Token de vérification manquant");
      return;
    }

    // Appeler l'API de vérification
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/verify-email?token=${token}`, {
      method: "POST",
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.message === "Email already verified") {
            setStatus("already_verified");
          } else {
            setStatus("success");
          }
        } else {
          const data = await res.json().catch(() => ({}));
          setErrorMessage(data.detail || "Le lien de vérification est invalide ou a expiré");
          setStatus("error");
        }
      })
      .catch(() => {
        setErrorMessage("Erreur de connexion au serveur");
        setStatus("error");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Geometric Pattern Background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0EA5E9 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
            {/* Loading State */}
            {status === "loading" && (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 dark:bg-sky-900/20 rounded-full mb-6">
                  <svg
                    className="w-8 h-8 text-sky-500 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Vérification en cours...
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Veuillez patienter pendant que nous vérifions votre email.
                </p>
              </div>
            )}

            {/* Success State */}
            {status === "success" && (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Email vérifié ! ✅
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter et profiter de tous nos services.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg shadow-sky-500/25"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Accéder au dashboard
                </Link>
              </div>
            )}

            {/* Already Verified State */}
            {status === "already_verified" && (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Déjà vérifié
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  Votre email a déjà été vérifié. Vous pouvez vous connecter normalement.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg shadow-sky-500/25"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Accéder au dashboard
                </Link>
              </div>
            )}

            {/* Error State */}
            {status === "error" && (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Vérification échouée
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  {errorMessage}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-8">
                  Le lien a peut-être expiré (valable 24h). Vous pouvez demander un nouveau lien depuis votre profil.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/profile"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg shadow-sky-500/25"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mon profil
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Accueil
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Besoin d'aide ?{" "}
              <a
                href="mailto:contact@pont-facturx.com"
                className="text-sky-500 hover:text-sky-600 font-medium"
              >
                Contactez-nous
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Chargement...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
