import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, ArrowLeft, CheckSquare, Users, Wrench, TrendingUp, AlertCircle, Sparkles, Target } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checklist : Préparer son entreprise à la facturation électronique | Factur-X 2026",
  description:
    "Guide complet pour préparer votre entreprise à la facturation électronique obligatoire. Timeline 6 mois, audit, formation équipe, tests, budget.",
  keywords: [
    "checklist facturation électronique",
    "préparer 2026",
    "transition Factur-X",
    "audit facturation",
    "formation comptable"
  ],
};

export default function Article() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-background/90">
        <nav className="mx-auto flex h-16 md:h-20 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-primary/10 text-primary">
              <FileText className="h-4 w-4 md:h-5 md:w-5" />
            </span>
            <div>
              <p className="font-display text-base md:text-xl font-semibold text-primary">
                Factur-X <span className="text-sky-500">Convert</span>
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/blog">
              <Button variant="ghost" className="px-3 md:px-4 text-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Blog
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="rounded-full px-4 md:px-6 text-xs md:text-sm font-semibold shadow-lg shadow-primary/20">
                Essai gratuit
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-24 md:pt-32">
        <article className="mx-auto max-w-4xl px-4 md:px-6 py-12 md:py-16">
          <div className="mb-8">
            <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 mb-4">
              Checklist
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white mb-6">
              Checklist : Préparer son entreprise à la facturation électronique
            </h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                19 janvier 2026
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                7 min de lecture
              </span>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 md:p-8 mb-8 dark:border-orange-900 dark:bg-orange-900/20">
              <p className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3">
                🎯 Votre plan d'action complet
              </p>
              <p className="text-orange-800 dark:text-orange-200 mb-0">
                Cette checklist vous guide pas à pas dans la préparation de votre entreprise à 
                l'obligation de facturation électronique. Suivez ce plan sur 6 mois pour une 
                transition sereine vers Factur-X avant le 1er septembre 2026.
              </p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 md:p-8 mb-8 dark:border-red-900 dark:bg-red-900/20">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                    ⏰ Date limite : 1er septembre 2026
                  </p>
                  <p className="text-red-800 dark:text-red-200 mb-0">
                    Il ne reste que <strong>8 mois</strong> pour vous préparer. Selon une étude de 
                    la DGFIP, 65% des PME n'ont pas encore commencé leur transition. Ne faites pas 
                    partie des retardataires : commencez maintenant !
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Timeline recommandée (6 mois)
            </h2>
            
            <div className="relative pl-8 border-l-4 border-sky-500 mb-12">
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute -left-[42px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white font-bold text-sm">
                    M-6
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Mars 2026 : Audit initial</h3>
                    <p className="text-muted-foreground">
                      Analysez votre situation actuelle et identifiez les besoins
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[42px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white font-bold text-sm">
                    M-5
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Avril 2026 : Sélection de la solution</h3>
                    <p className="text-muted-foreground">
                      Comparez les outils et choisissez votre plateforme Factur-X
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[42px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white font-bold text-sm">
                    M-4
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Mai 2026 : Formation des équipes</h3>
                    <p className="text-muted-foreground">
                      Formez vos comptables et commerciaux aux nouveaux processus
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[42px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white font-bold text-sm">
                    M-3
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Juin 2026 : Configuration & intégration</h3>
                    <p className="text-muted-foreground">
                      Connectez votre ERP et configurez les workflows
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[42px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white font-bold text-sm">
                    M-2
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Juillet 2026 : Phase de test</h3>
                    <p className="text-muted-foreground">
                      Testez avec quelques clients pilotes et ajustez
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[42px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white font-bold text-sm">
                    M-1
                  </div>
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-900/20">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Août 2026 : Déploiement complet</h3>
                    <p className="text-muted-foreground">
                      Généralisez à l'ensemble de votre facturation
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[42px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-bold text-sm">
                    J-0
                  </div>
                  <div className="rounded-2xl border border-green-300 bg-green-100 p-6 dark:border-green-800 dark:bg-green-900/30">
                    <h3 className="text-xl font-semibold text-foreground mb-2">🎉 1er septembre 2026 : Conformité atteinte</h3>
                    <p className="text-muted-foreground">
                      Vous êtes prêt pour l'obligation légale !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              <CheckSquare className="inline-block h-8 w-8 mr-3 text-sky-500" />
              Étape 1 : Audit initial (Mois -6)
            </h2>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-foreground mb-4">✅ Analyser votre volume de facturation</h3>
              <div className="space-y-3 text-muted-foreground mb-6">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Comptabiliser le nombre de factures émises par mois (clients B2B, B2C, secteur public)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Compter les factures fournisseurs reçues chaque mois</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Identifier les typologies : factures simples, avoirs, avances, acomptes, factures récurrentes</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Estimer le temps actuellement passé au traitement manuel des factures</span>
                </label>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4 mt-6">✅ Auditer vos outils actuels</h3>
              <div className="space-y-3 text-muted-foreground mb-6">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Lister tous les logiciels utilisés (ERP, comptabilité, CRM, facturation)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Vérifier si vos outils supportent déjà Factur-X / EN 16931</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Contacter vos éditeurs pour connaître leur feuille de route Factur-X</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Identifier les intégrations nécessaires (API, connecteurs, fichiers exports)</span>
                </label>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4 mt-6">✅ Mapper vos processus métier</h3>
              <div className="space-y-3 text-muted-foreground">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Documenter le circuit de validation des factures (qui approuve, qui paie, délais)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Identifier les personnes clés : comptables, DAF, commerciaux, acheteurs</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Répertorier les cas spéciaux : factures internationales, multi-devises, multi-entités</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Évaluer votre niveau de maturité digitale (0-10)</span>
                </label>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              <Wrench className="inline-block h-8 w-8 mr-3 text-purple-500" />
              Étape 2 : Choix de la solution (Mois -5)
            </h2>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-foreground mb-4">✅ Définir vos critères de sélection</h3>
              <div className="space-y-3 text-muted-foreground mb-6">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Budget disponible (one-time + abonnement mensuel)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Facilité d'intégration avec votre ERP existant</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Qualité du support client et accompagnement</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Scalabilité (évolution du volume de factures)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Conformité et certifications (ISO, RGPD, hébergement France)</span>
                </label>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4 mt-6">✅ Comparer les solutions du marché</h3>
              <div className="space-y-3 text-muted-foreground mb-6">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Solutions SaaS dédiées (Factur-X Convert, Tiime, Pennylane, etc.)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Modules Factur-X de votre ERP actuel (Sage, Cegid, SAP, etc.)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Plateformes de dématérialisation (Chorus Pro, Docuware, etc.)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Solutions open-source (si ressources IT en interne)</span>
                </label>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4 mt-6">✅ Tester les solutions shortlistées</h3>
              <div className="space-y-3 text-muted-foreground">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Demander des démos personnalisées (3-5 solutions minimum)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Tester avec vos vraies factures en période d'essai gratuite</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Mesurer la précision de l'OCR et la qualité du XML généré</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Valider la facilité d'utilisation avec votre équipe comptable</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Prendre une décision finale et signer le contrat</span>
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 md:p-8 mb-8 dark:border-sky-900 dark:bg-sky-900/20">
              <p className="text-sm text-sky-800 dark:text-sky-200 mb-0">
                💡 <strong>Conseil :</strong> Pour une PME de 50-200 employés, privilégiez une solution 
                SaaS clé en main comme Factur-X Convert. Vous éviterez les lourds projets d'intégration 
                et serez opérationnel en quelques jours au lieu de plusieurs mois.
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              <Users className="inline-block h-8 w-8 mr-3 text-green-500" />
              Étape 3 : Formation des équipes (Mois -4)
            </h2>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-foreground mb-4">✅ Former l'équipe comptabilité</h3>
              <div className="space-y-3 text-muted-foreground mb-6">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Session 1 : Comprendre Factur-X et la norme EN 16931 (2h)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Session 2 : Prise en main de la plateforme (3h pratique)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Session 3 : Gestion des erreurs et cas particuliers (2h)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Créer un document de référence interne (FAQ, procédures)</span>
                </label>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4 mt-6">✅ Sensibiliser les commerciaux</h3>
              <div className="space-y-3 text-muted-foreground mb-6">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Expliquer les avantages pour les clients (traitement automatique, gain de temps)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Préparer un argumentaire commercial ("Nous sommes déjà prêts pour 2026")</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Former à la détection des clients non équipés (pour les accompagner)</span>
                </label>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4 mt-6">✅ Impliquer la direction</h3>
              <div className="space-y-3 text-muted-foreground">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Présenter le projet et les bénéfices attendus au COMEX/CODIR</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Définir des indicateurs de suivi (KPI : temps de traitement, taux d'erreur, économies)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Nommer un chef de projet dédié à la transition</span>
                </label>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              <Sparkles className="inline-block h-8 w-8 mr-3 text-purple-500" />
              Étape 4 : Configuration & Tests (Mois -3 à -2)
            </h2>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-foreground mb-4">✅ Configuration technique</h3>
              <div className="space-y-3 text-muted-foreground mb-6">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Connecter votre ERP à la plateforme Factur-X (API ou exports CSV)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Importer votre base clients (SIRET, TVA intracommunautaire, adresses)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Configurer vos templates de facture (logo, mentions légales, CGV)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Paramétrer les workflows de validation (qui valide, délais, notifications)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Tester l'envoi automatique par email ou API vers vos clients</span>
                </label>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4 mt-6">✅ Phase pilote</h3>
              <div className="space-y-3 text-muted-foreground mb-6">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Sélectionner 5-10 clients pilotes (idéalement déjà équipés Factur-X)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Les prévenir en amont du changement (email d'information)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Émettre vos premières factures Factur-X réelles</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Recueillir les retours clients (problème d'import ? Lisibilité OK ?)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Ajuster votre configuration selon les feedbacks</span>
                </label>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4 mt-6">✅ Tests de validation</h3>
              <div className="space-y-3 text-muted-foreground">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Tester tous les cas d'usage : facture simple, avoir, acompte, international</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Vérifier la conformité EN 16931 avec un outil de validation</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Uploader un fichier test sur Chorus Pro (pour valider l'acceptation)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Importer un Factur-X dans votre logiciel comptable (test d'interopérabilité)</span>
                </label>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              <Target className="inline-block h-8 w-8 mr-3 text-green-500" />
              Étape 5 : Déploiement complet (Mois -1)
            </h2>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-foreground mb-4">✅ Communication clients</h3>
              <div className="space-y-3 text-muted-foreground mb-6">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Envoyer un email à tous vos clients B2B pour annoncer le passage à Factur-X</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Créer une page FAQ sur votre site (expliquer le changement, avantages, support)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Proposer un webinar ou tutoriel vidéo pour les clients qui veulent comprendre</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Mettre à disposition un contact dédié pour les questions (support@...)</span>
                </label>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4 mt-6">✅ Migration totale</h3>
              <div className="space-y-3 text-muted-foreground mb-6">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Basculer 100% de votre facturation sur Factur-X</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Surveiller de près les premiers jours (disponibilité équipe support renforcée)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Monitorer les indicateurs : taux de rejet, temps de traitement, satisfaction client</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Archiver les anciens PDF pour référence (période de transition 1-2 mois)</span>
                </label>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4 mt-6">✅ Optimisation continue</h3>
              <div className="space-y-3 text-muted-foreground">
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Organiser un point hebdomadaire pendant le 1er mois (retour d'expérience équipe)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Identifier les points de friction et améliorer les process</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Mesurer les gains réels (temps gagné, réduction erreurs, délai de paiement)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer hover:text-foreground transition-colors">
                  <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span>Partager les résultats avec la direction et l'ensemble de l'entreprise</span>
                </label>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Estimation budgétaire
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Voici une estimation des coûts pour une PME de 50 employés avec 500 factures/mois :
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-semibold text-foreground">Poste de dépense</span>
                  <span className="font-semibold text-foreground">Montant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Abonnement solution SaaS (année 1)</span>
                  <span className="font-semibold text-foreground">1 500 - 3 000 €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Intégration / configuration (one-time)</span>
                  <span className="font-semibold text-foreground">500 - 2 000 €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Formation équipes (2-3 sessions)</span>
                  <span className="font-semibold text-foreground">800 - 1 500 €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Accompagnement / support (optionnel)</span>
                  <span className="font-semibold text-foreground">500 - 1 000 €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Temps interne (chef de projet, tests)</span>
                  <span className="font-semibold text-foreground">2 000 - 4 000 €</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-300 dark:border-slate-600">
                  <span className="font-bold text-foreground text-lg">Total investissement</span>
                  <span className="font-bold text-foreground text-xl">5 300 - 11 500 €</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 md:p-8 mb-8 dark:border-green-900 dark:bg-green-900/20">
              <div className="flex items-start gap-4">
                <TrendingUp className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    💰 ROI : 3-6 mois
                  </p>
                  <p className="text-green-800 dark:text-green-200 mb-0">
                    Avec une économie de 26 000 €/an sur le traitement des factures (voir notre article 
                    comparatif), votre investissement est rentabilisé en moins de 6 mois. Ensuite, ce sont 
                    des bénéfices nets chaque année : <strong>gain de temps, réduction des erreurs, 
                    satisfaction client améliorée.</strong>
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Les pièges à éviter
            </h2>

            <div className="space-y-4 mb-8">
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  ❌ Attendre le dernier moment
                </h3>
                <p className="text-muted-foreground mb-0">
                  65% des PME n'ont pas encore commencé leur transition. Résultat : embouteillage en 
                  juillet-août 2026, manque de disponibilité des intégrateurs, stress maximal. 
                  <strong className="text-foreground"> Commencez MAINTENANT.</strong>
                </p>
              </div>

              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-900 dark:bg-orange-900/20">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  ❌ Négliger la formation des équipes
                </h3>
                <p className="text-muted-foreground mb-0">
                  Un outil mal compris = outil mal utilisé = échec. Investissez dans la formation, 
                  créez des tutoriels internes, nommez des "champions Factur-X" qui aideront leurs collègues.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-900 dark:bg-purple-900/20">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                  ❌ Choisir une solution sur le prix seul
                </h3>
                <p className="text-muted-foreground mb-0">
                  La solution la moins chère n'est pas forcément la moins coûteuse à long terme. 
                  Privilégiez la <strong className="text-foreground">facilité d'usage, la qualité du 
                  support et l'évolutivité</strong>. Un abonnement à 50 €/mois de plus peut vous faire 
                  gagner des centaines d'heures.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 dark:border-sky-900 dark:bg-sky-900/20">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-sky-600" />
                  ❌ Oublier de communiquer avec vos clients
                </h3>
                <p className="text-muted-foreground mb-0">
                  Ne changez pas de format de facture du jour au lendemain sans prévenir. Un email 
                  d'information 2-3 semaines avant + une page FAQ = moins de questions au support.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-orange-50 to-sky-50 p-8 md:p-10 text-center my-12 dark:border-slate-800 dark:from-orange-900/20 dark:to-sky-900/20">
              <h3 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-4">
                Besoin d'aide pour démarrer ?
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Factur-X Convert vous accompagne dans votre transition. Solution SaaS clé en main, 
                formation incluse, support réactif. Testez gratuitement dès aujourd'hui.
              </p>
              <Link href="/auth">
                <Button size="lg" className="rounded-2xl">
                  Démarrer ma transition
                </Button>
              </Link>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Conclusion
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              La préparation à la facturation électronique n'est pas une course de vitesse, mais un 
              <strong className="text-foreground"> marathon bien planifié</strong>. En suivant cette 
              checklist sur 6 mois, vous donnez à votre entreprise toutes les chances de réussir sa 
              transition sans stress ni précipitation.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Rappelez-vous : <strong className="text-foreground">plus vous commencez tôt, plus vous 
              avez de marge de manœuvre</strong> pour corriger les erreurs, former vos équipes et 
              optimiser vos processus. Les entreprises qui anticipent transformeront cette obligation 
              légale en véritable avantage compétitif : gain de temps, réduction des coûts, image 
              moderne et digitale.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Alors, n'attendez plus : imprimez cette checklist, rassemblez votre équipe, et lancez-vous 
              dès cette semaine dans la phase d'audit. Le 1er septembre 2026 arrivera plus vite que vous 
              ne le pensez. Soyez prêt !
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <Link href="/blog">
              <Button variant="ghost" className="group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Retour au blog
              </Button>
            </Link>
          </div>
        </article>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-10 md:py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Factur-X Convert. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
