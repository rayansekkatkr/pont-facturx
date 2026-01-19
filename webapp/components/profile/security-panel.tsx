"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";

export function SecurityPanel() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChanging(true);

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      setIsChanging(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères");
      setIsChanging(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        alert("Mot de passe modifié avec succès");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const data = await response.json();
        alert(data.detail || "Erreur lors du changement de mot de passe");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Change Password Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Changer le mot de passe</h2>
            <p className="text-sm text-slate-500">Modifiez votre mot de passe pour sécuriser votre compte</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="currentPassword" className="text-sm font-semibold text-slate-700">
              Mot de passe actuel
            </Label>
            <div className="relative mt-2">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="newPassword" className="text-sm font-semibold text-slate-700">
              Nouveau mot de passe
            </Label>
            <div className="relative mt-2">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                minLength={8}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Minimum 8 caractères, incluant lettres et chiffres recommandés
            </p>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
              Confirmer le nouveau mot de passe
            </Label>
            <div className="relative mt-2">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={8}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isChanging}
            className="w-full rounded-xl bg-sky-500 px-6 py-3 font-semibold hover:bg-sky-600 sm:w-auto"
          >
            {isChanging ? "Modification..." : "Modifier le mot de passe"}
          </Button>
        </form>
      </div>

      {/* Security Recommendations */}
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <div className="mb-4 flex items-center gap-3">
          <Shield className="h-6 w-6 text-amber-600" />
          <h3 className="text-lg font-bold text-amber-900">Recommandations de sécurité</h3>
        </div>
        <ul className="space-y-3 text-sm text-amber-800">
          <li className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Utilisez un mot de passe unique pour chaque service</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Activez l'authentification à deux facteurs (2FA) quand c'est possible</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Ne partagez jamais votre mot de passe avec qui que ce soit</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Changez régulièrement votre mot de passe (tous les 3-6 mois)</span>
          </li>
        </ul>
      </div>

      {/* Active Sessions (placeholder for future feature) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sessions actives</h2>
            <p className="text-sm text-slate-500">Gérez les appareils connectés à votre compte</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-600">
            <strong className="text-slate-900">Session actuelle</strong> — Navigateur actuel
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Cette session expirera après 30 minutes d'inactivité
          </p>
        </div>
      </div>
    </div>
  );
}
