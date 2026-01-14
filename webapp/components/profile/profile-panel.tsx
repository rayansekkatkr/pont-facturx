"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  first_name: z.string().max(120).optional().or(z.literal("")),
  last_name: z.string().max(120).optional().or(z.literal("")),
  company: z.string().max(200).optional().or(z.literal("")),
  email: z.string().email(),
  newsletter_opt_in: z.boolean().optional(),
  remember_profile: z.boolean().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

const STORAGE_KEY = "pfxt_profile_opt";

function loadLocalPrefs() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Pick<ProfileFormData, "newsletter_opt_in" | "remember_profile">;
  } catch {
    return null;
  }
}

function persistLocalPrefs(prefs: Pick<ProfileFormData, "newsletter_opt_in" | "remember_profile">) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function ProfilePanel() {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<ProfileFormData | null>(null);
  const [initialValue, setInitialValue] = useState<ProfileFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      try {
        setError(null);
        setLoading(true);
        const res = await fetch("/api/proxy/v1/auth/me", {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (res.status === 401) {
          router.push("/");
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }

        const body = (await res.json()) as ProfileFormData;
        const prefs = loadLocalPrefs();
        const merged = {
          ...body,
          newsletter_opt_in: prefs?.newsletter_opt_in ?? false,
          remember_profile: prefs?.remember_profile ?? true,
        } satisfies ProfileFormData;

        if (!cancelled) {
          setData(merged);
          setInitialValue(merged);
        }
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        console.error("load profile error", err);
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Erreur inattendue");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [router]);

  const dirty = useMemo(() => {
    if (!data || !initialValue) return false;
    return JSON.stringify(data) !== JSON.stringify(initialValue);
  }, [data, initialValue]);

  const handleChange = (key: keyof ProfileFormData, value: string | boolean) => {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data) return;

    const parsed = profileSchema.safeParse(data);
    if (!parsed.success) {
      toast({
        title: "Profil",
        description: "Merci de vérifier les champs saisis",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/proxy/v1/auth/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      if (res.status === 401) {
        router.push("/");
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const body = (await res.json()) as ProfileFormData;
      setData(body);
      setInitialValue(body);
      persistLocalPrefs({
        newsletter_opt_in: Boolean(body.newsletter_opt_in),
        remember_profile: Boolean(body.remember_profile),
      });

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées",
      });
    } catch (err) {
      console.error("profile save error", err);
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      toast({
        title: "Impossible de sauvegarder",
        description:
          err instanceof Error ? err.message : "Veuillez réessayer dans un instant",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement du profil…</CardTitle>
          <CardDescription>Récupération des paramètres du compte</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Impossible de charger le profil</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => router.refresh()}>
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="border border-primary/10 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle>Identité</CardTitle>
          <CardDescription>
            Ces informations apparaîtront sur vos factures Factur-X exportées
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="first_name">Prénom</Label>
            <Input
              id="first_name"
              value={data.first_name ?? ""}
              onChange={(e) => handleChange("first_name", e.target.value)}
              placeholder="Ex. Marie"
            />
          </div>
          <div>
            <Label htmlFor="last_name">Nom</Label>
            <Input
              id="last_name"
              value={data.last_name ?? ""}
              onChange={(e) => handleChange("last_name", e.target.value)}
              placeholder="Ex. Dupont"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              type="email"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-primary/10 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle>Entreprise</CardTitle>
          <CardDescription>Optionnel mais utile pour pré-remplir vos conversions</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="company">Raison sociale</Label>
            <Input
              id="company"
              value={data.company ?? ""}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="Pont Factur-X SAS"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-primary/10 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
          <CardDescription>Mémorisation locale, newsletter, etc.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Mémoriser mes réglages</p>
              <p className="text-sm text-muted-foreground">
                Conserve votre profil et le dernier profil Factur-X utilisé sur cet appareil.
              </p>
            </div>
            <Switch
              checked={Boolean(data.remember_profile)}
              onCheckedChange={(val) => handleChange("remember_profile", val)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Recevoir les nouveautés</p>
              <p className="text-sm text-muted-foreground">
                Brief mensuel avec mises à jour produit, cas d'usage et guides PDF/A-3.
              </p>
            </div>
            <Switch
              checked={Boolean(data.newsletter_opt_in)}
              onCheckedChange={(val) => handleChange("newsletter_opt_in", val)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 border border-primary/10 bg-card/60 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Les modifications sont enregistrées sur votre compte sécurisé.
          </p>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" disabled={!dirty || saving} onClick={() => setData(initialValue)}>
            Réinitialiser
          </Button>
          <Button type="submit" disabled={!dirty || saving}>
            {saving ? "Sauvegarde…" : "Enregistrer"}
          </Button>
        </div>
      </div>
    </form>
  );
}
