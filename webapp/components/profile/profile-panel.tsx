"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BadgeCheck, Building2, Mail } from "lucide-react";

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
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const saveProfile = async (payload: ProfileFormData, options?: { silent?: boolean }) => {
    if (saving) return;
    const parsed = profileSchema.safeParse(payload);
    if (!parsed.success) {
      if (!options?.silent) {
        toast({
          title: "Profil",
          description: "Merci de vérifier les champs saisis",
          variant: "destructive",
        });
      }
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

      if (!options?.silent) {
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été sauvegardées",
        });
      }
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
  };

  const handleAutoSave = async () => {
    if (!data || !initialValue) return;
    const keys: Array<keyof ProfileFormData> = [
      "first_name",
      "last_name",
      "email",
      "company",
    ];
    const changed = keys.some(
      (key) => (data[key] ?? "") !== (initialValue[key] ?? ""),
    );
    if (!changed) return;
    await saveProfile(data, { silent: true });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data || !dirty || saving) return;
    setConfirmOpen(true);
  }

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-slate-200/60 bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
        <h2 className="text-lg font-bold text-slate-900">Chargement du profil…</h2>
        <p className="mt-2 text-sm text-slate-500">Récupération des paramètres du compte</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-slate-200/60 bg-white p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
        <h2 className="text-lg font-bold text-slate-900">Impossible de charger le profil</h2>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <Button variant="outline" onClick={() => router.refresh()} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
        <div className="border-b border-slate-100 bg-slate-50/30 p-8">
          <div className="mb-1 flex items-center gap-3">
            <BadgeCheck className="h-5 w-5 text-teal-500" />
            <h2 className="text-xl font-bold text-slate-900">Identité</h2>
          </div>
          <p className="text-sm text-slate-500">
            Ces informations seront utilisées comme émetteur par défaut sur vos factures.
          </p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="first_name" className="ml-1 text-sm font-bold text-slate-700">
                Prénom
              </Label>
              <Input
                id="first_name"
                value={data.first_name ?? ""}
                onChange={(e) => handleChange("first_name", e.target.value)}
                onBlur={handleAutoSave}
                placeholder="Votre prénom"
                className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-5 py-3.5 text-slate-900 focus-visible:ring-sky-200"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="last_name" className="ml-1 text-sm font-bold text-slate-700">
                Nom
              </Label>
              <Input
                id="last_name"
                value={data.last_name ?? ""}
                onChange={(e) => handleChange("last_name", e.target.value)}
                onBlur={handleAutoSave}
                placeholder="Votre nom"
                className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-5 py-3.5 text-slate-900 focus-visible:ring-sky-200"
              />
            </div>
            <div className="space-y-2.5 md:col-span-2">
              <Label htmlFor="email" className="ml-1 text-sm font-bold text-slate-700">
                Adresse e-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  value={data.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={handleAutoSave}
                  type="email"
                  required
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 pl-12 pr-5 text-slate-900 focus-visible:ring-sky-200"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
        <div className="border-b border-slate-100 bg-slate-50/30 p-8">
          <div className="mb-1 flex items-center gap-3">
            <Building2 className="h-5 w-5 text-teal-500" />
            <h2 className="text-xl font-bold text-slate-900">Entreprise</h2>
          </div>
          <p className="text-sm text-slate-500">
            Renseignez votre entité légale pour automatiser la saisie.
          </p>
        </div>
        <div className="p-8">
          <div className="space-y-2.5">
            <Label htmlFor="company" className="ml-1 text-sm font-bold text-slate-700">
              Raison sociale
            </Label>
            <Input
              id="company"
              value={data.company ?? ""}
              onChange={(e) => handleChange("company", e.target.value)}
              onBlur={handleAutoSave}
              placeholder="Pont Factur-X SAS"
              className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 px-5 py-3.5 text-slate-900 focus-visible:ring-sky-200"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col items-end gap-4 pb-20 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          className="text-sm font-bold text-slate-400 hover:text-slate-600"
          disabled={!dirty || saving}
          onClick={() => setData(initialValue)}
        >
          Réinitialiser
        </Button>
        <Button
          type="submit"
          disabled={!dirty || saving}
          className="rounded-2xl bg-slate-900 px-10 py-6 text-sm font-bold text-white shadow-xl shadow-slate-200 transition-all hover:-translate-y-0.5 hover:bg-slate-800"
        >
          {saving ? "Sauvegarde…" : "Enregistrer les modifications"}
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la modification</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous enregistrer ces changements sur votre profil ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!data) return;
                void saveProfile(data);
              }}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
