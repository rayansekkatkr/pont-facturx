"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, ArrowLeft } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

type AuthError = string | null;

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<AuthError>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupCompany, setSignupCompany] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  async function readErrorMessage(r: Response): Promise<string> {
    try {
      const data = await r.json();
      // FastAPI: {"detail": "..."} ou {"detail":[...]}
      const d = (data as any)?.detail;
      if (typeof d === "string") return d;
      if (Array.isArray(d))
        return d.map((x) => x?.msg || JSON.stringify(x)).join("\n");
      return JSON.stringify(data);
    } catch {
      try {
        return await r.text();
      } catch {
        return "Erreur inconnue";
      }
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setIsLoading(true);

    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ⚠️ on envoie au backend via le proxy Next (route handler)
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (!r.ok) {
        throw new Error(await readErrorMessage(r));
      }

      router.push("/dashboard");
    } catch (e: any) {
      setErr(e?.message || "Connexion impossible");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setIsLoading(true);

    try {
      const r = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
          first_name: signupFirstName,
          last_name: signupLastName,
          company: signupCompany || null,
        }),
      });

      if (!r.ok) {
        throw new Error(await readErrorMessage(r));
      }

      router.push("/dashboard");
    } catch (e: any) {
      setErr(e?.message || "Inscription impossible");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential?: string) => {
    if (!credential) {
      setErr("Google: credential manquante");
      return;
    }
    setErr(null);
    setIsLoading(true);

    try {
      const r = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: credential }),
      });

      if (!r.ok) {
        throw new Error(await readErrorMessage(r));
      }

      router.push("/dashboard");
    } catch (e: any) {
      setErr(e?.message || "Connexion Google impossible");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(14,165,233,0.06)_1px,transparent_0)] [background-size:24px_24px]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-6 py-6 backdrop-blur-sm lg:px-12">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500 text-white shadow-lg shadow-sky-200">
              <FileText className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Factur-X <span className="text-sky-500">Convert</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-sky-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-xl">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="mb-8 mx-auto flex w-full max-w-sm rounded-xl bg-slate-200/50 p-1 shadow-inner">
                <TabsTrigger className="flex-1 rounded-lg py-2 text-sm font-medium text-slate-600 transition-all hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm" value="login">
                  Connexion
                </TabsTrigger>
                <TabsTrigger className="flex-1 rounded-lg py-2 text-sm font-semibold text-slate-600 transition-all hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-sky-500 data-[state=active]:shadow-sm" value="signup">
                  Inscription
                </TabsTrigger>
              </TabsList>

              {err ? (
                <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 whitespace-pre-wrap">
                  {err}
                </div>
              ) : null}

              <TabsContent value="login">
                <div className="w-full max-w-xl rounded-xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 md:p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Connexion</h2>
                    <p className="mt-2 text-slate-500">
                      Connectez-vous à votre compte pour accéder à vos conversions
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="login-email" className="text-sm font-semibold text-slate-700">
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="votre@email.com"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        autoComplete="email"
                        className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="text-sm font-semibold text-slate-700">
                          Mot de passe
                        </Label>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-xs font-semibold text-sky-500"
                          type="button"
                          disabled
                        >
                          Mot de passe oublié ?
                        </Button>
                      </div>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        autoComplete="current-password"
                        className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-400"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox id="remember" className="h-4 w-4 border-slate-300" />
                      <label htmlFor="remember" className="text-sm text-slate-600">
                        Se souvenir de moi
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full rounded-xl bg-sky-500 py-4 font-bold text-white shadow-lg shadow-sky-200"
                      disabled={isLoading}
                    >
                      {isLoading ? "Connexion..." : "Se connecter"}
                    </Button>
                  </form>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200"></span>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-slate-500">
                        Ou continuer avec
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={(cred) => handleGoogleSuccess(cred.credential)}
                      onError={() => setErr("Connexion Google annulée ou échouée")}
                      useOneTap={false}
                    />
                  </div>
                </div>

                <p className="mt-8 text-center text-sm text-slate-500">
                  En créant un compte, vous bénéficiez de{" "}
                  <span className="font-semibold text-sky-500">3 conversions gratuites</span>
                </p>
              </TabsContent>

              <TabsContent value="signup">
                <div className="w-full max-w-xl rounded-xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 md:p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Créer un compte</h2>
                    <p className="text-slate-500">
                      Créez votre compte et bénéficiez de{" "}
                      <span className="font-semibold text-sky-500">3 conversions gratuites</span>
                    </p>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="signup-firstname" className="text-sm font-semibold text-slate-700">
                          Prénom
                        </Label>
                        <Input
                          id="signup-firstname"
                          type="text"
                          placeholder="Jean"
                          required
                          value={signupFirstName}
                          onChange={(e) => setSignupFirstName(e.target.value)}
                          autoComplete="given-name"
                          className="rounded-lg border-slate-200 bg-white px-4 py-3 focus:border-sky-400"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="signup-lastname" className="text-sm font-semibold text-slate-700">
                          Nom
                        </Label>
                        <Input
                          id="signup-lastname"
                          type="text"
                          placeholder="Dupont"
                          required
                          value={signupLastName}
                          onChange={(e) => setSignupLastName(e.target.value)}
                          autoComplete="family-name"
                          className="rounded-lg border-slate-200 bg-white px-4 py-3 focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-company" className="text-sm font-semibold text-slate-700">
                        Entreprise
                      </Label>
                      <Input
                        id="signup-company"
                        type="text"
                        placeholder="Nom de votre entreprise"
                        value={signupCompany}
                        onChange={(e) => setSignupCompany(e.target.value)}
                        autoComplete="organization"
                        className="rounded-lg border-slate-200 bg-white px-4 py-3 focus:border-sky-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email" className="text-sm font-semibold text-slate-700">
                        Email professionnel
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="votre@email.com"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        autoComplete="email"
                        className="rounded-lg border-slate-200 bg-white px-4 py-3 focus:border-sky-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password" className="text-sm font-semibold text-slate-700">
                        Mot de passe
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        autoComplete="new-password"
                        className="rounded-lg border-slate-200 bg-white px-4 py-3 focus:border-sky-400"
                      />
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        Minimum 8 caractères (recommandé: majuscules + chiffres)
                      </p>
                    </div>

                    <div className="flex items-start gap-3 py-2">
                      <Checkbox id="terms" required className="mt-1 h-5 w-5" />
                      <label htmlFor="terms" className="cursor-pointer text-sm leading-snug text-slate-600">
                        J'accepte les{" "}
                        <Button
                          variant="link"
                          className="h-auto p-0 text-sm font-medium text-sky-500"
                          type="button"
                          disabled
                        >
                          conditions d'utilisation
                        </Button>
                        {" et la "}
                        <Button
                          variant="link"
                          className="h-auto p-0 text-sm font-medium text-sky-500"
                          type="button"
                          disabled
                        >
                          politique de confidentialité
                        </Button>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="mt-2 w-full rounded-xl bg-sky-500 py-4 font-bold text-white shadow-lg shadow-sky-200"
                      disabled={isLoading}
                    >
                      {isLoading ? "Création..." : "Créer mon compte"}
                    </Button>
                  </form>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200"></span>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-slate-500">Ou continuer avec</span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={(cred) => handleGoogleSuccess(cred.credential)}
                      onError={() => setErr("Connexion Google annulée ou échouée")}
                      useOneTap={false}
                    />
                  </div>
                </div>

                <p className="mt-8 text-center text-sm text-slate-500">
                  En créant un compte, vous bénéficiez de{" "}
                  <span className="font-semibold text-sky-500">3 conversions gratuites</span>
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
