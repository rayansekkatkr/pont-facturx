"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function VerifyCodePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setErrorMessage("Le code doit contenir 6 chiffres");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Non authentifié. Veuillez vous reconnecter.");
        setStatus("error");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-code?code=${code}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        setStatus("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setErrorMessage(data.detail || "Code incorrect");
        setStatus("error");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      setStatus("error");
    }
  };

  const handleResend = async () => {
    setResending(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Un nouveau code a été envoyé à votre email !");
      } else {
        setErrorMessage(data.detail || "Impossible de renvoyer le code");
        setStatus("error");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setErrorMessage("Une erreur est survenue");
      setStatus("error");
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && code.length === 6) {
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📧</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Vérification de l'email
            </h1>
            <p className="text-sky-100 text-sm">
              Entrez le code à 6 chiffres envoyé à votre email
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {status === "success" ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Email vérifié ! ✨
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Redirection vers le dashboard...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Code Input */}
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Code de vérification
                  </label>
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={code}
                    onChange={handleCodeChange}
                    onKeyPress={handleKeyPress}
                    placeholder="000000"
                    className="text-center text-2xl font-mono tracking-widest h-14"
                    disabled={status === "loading"}
                    autoFocus
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    Le code est valide pendant 15 minutes
                  </p>
                </div>

                {/* Error Message */}
                {status === "error" && errorMessage && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
                  </div>
                )}

                {/* Verify Button */}
                <Button
                  onClick={handleVerify}
                  disabled={code.length !== 6 || status === "loading"}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    "Vérifier mon code"
                  )}
                </Button>

                {/* Resend Code */}
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Vous n'avez pas reçu le code ?
                  </p>
                  <Button
                    variant="ghost"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      "Renvoyer le code"
                    )}
                  </Button>
                </div>


              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              🔒 Votre code de vérification est personnel et confidentiel
            </p>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Besoin d'aide ?{" "}
            <a
              href="mailto:contact@pont-facturx.com"
              className="text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              Contactez-nous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
