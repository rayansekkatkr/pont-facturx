"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      if (Array.isArray(d)) return d.map((x) => x?.msg || JSON.stringify(x)).join("\n");
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Factur-X Convert</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
        </div>
      </header>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            {/* Erreur globale */}
            {err ? (
              <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive whitespace-pre-wrap">
                {err}
              </div>
            ) : null}

            {/* Login Tab */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Connexion</CardTitle>
                  <CardDescription>Connectez-vous à votre compte pour accéder à vos conversions</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="votre@email.com"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Mot de passe</Label>
                        <Button variant="link" className="h-auto p-0 text-sm" type="button" disabled>
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
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Se souvenir de moi
                      </label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Connexion..." : "Se connecter"}
                    </Button>
                  {/* Google login (commun) */}
                    <div className="mb-6">
                      <div className="text-sm text-muted-foreground mb-2">Ou continuer avec</div>
                      <div className="flex justify-center">
                        <GoogleLogin
                          onSuccess={(cred) => handleGoogleSuccess(cred.credential)}
                          onError={() => setErr("Connexion Google annulée ou échouée")}
                          useOneTap={false}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Créer un compte</CardTitle>
                  <CardDescription>Créez votre compte et bénéficiez de 10 conversions gratuites</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-firstname">Prénom</Label>
                        <Input
                          id="signup-firstname"
                          type="text"
                          placeholder="Jean"
                          required
                          value={signupFirstName}
                          onChange={(e) => setSignupFirstName(e.target.value)}
                          autoComplete="given-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-lastname">Nom</Label>
                        <Input
                          id="signup-lastname"
                          type="text"
                          placeholder="Dupont"
                          required
                          value={signupLastName}
                          onChange={(e) => setSignupLastName(e.target.value)}
                          autoComplete="family-name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-company">Entreprise</Label>
                      <Input
                        id="signup-company"
                        type="text"
                        placeholder="Nom de votre entreprise"
                        value={signupCompany}
                        onChange={(e) => setSignupCompany(e.target.value)}
                        autoComplete="organization"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email professionnel</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="votre@email.com"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Mot de passe</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                      <p className="text-xs text-muted-foreground">Minimum 8 caractères (recommandé: majuscules + chiffres)</p>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" required />
                      <label
                        htmlFor="terms"
                        className="text-sm leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {"J'accepte les "}
                        <Button variant="link" className="h-auto p-0 text-sm" type="button" disabled>
                          conditions d'utilisation
                        </Button>
                        {" et la "}
                        <Button variant="link" className="h-auto p-0 text-sm" type="button" disabled>
                          politique de confidentialité
                        </Button>
                      </label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Création..." : "Créer mon compte"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            En créant un compte, vous bénéficiez de 10 conversions gratuites
          </p>
        </div>
      </div>
    </div>
  );
}
