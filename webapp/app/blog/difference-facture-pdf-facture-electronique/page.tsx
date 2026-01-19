import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, ArrowLeft, Shield, Zap, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Différence entre facture PDF et facture électronique Factur-X | Guide Comparatif",
  description:
    "Comparaison détaillée entre facture PDF classique et facture électronique Factur-X. Découvrez les avantages, implications légales et gains d'automatisation.",
  keywords: [
    "différence PDF Factur-X",
    "facture électronique vs PDF",
    "comparaison formats",
    "PDF structuré",
    "facturation EN 16931"
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
            <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mb-4">
              Comparatif
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white mb-6">
              Différence entre facture PDF et facture électronique Factur-X
            </h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                19 janvier 2026
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                6 min de lecture
              </span>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 md:p-8 mb-8 dark:border-purple-900 dark:bg-purple-900/20">
              <p className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
                🎯 Ce que vous allez découvrir
              </p>
              <p className="text-purple-800 dark:text-purple-200 mb-0">
                Comprendre les différences fondamentales entre un simple PDF et une facture électronique 
                Factur-X vous permettra de prendre les bonnes décisions pour votre entreprise avant 
                l'obligation de septembre 2026. Découvrez pourquoi un PDF seul ne suffit plus.
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Le PDF classique : un format figé
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Le PDF (Portable Document Format) est un format de document créé dans les années 1990 
              pour garantir un affichage identique sur n'importe quel appareil. Excellent pour la 
              lecture humaine, il présente cependant des <strong className="text-foreground">limites 
              majeures pour l'automatisation</strong>.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-semibold text-foreground mb-4">Caractéristiques du PDF classique</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                  <span><strong className="text-foreground">Données non structurées :</strong> Les informations sont "aplaties" sous forme d'image ou de texte, sans hiérarchie exploitable par une machine.</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                  <span><strong className="text-foreground">Saisie manuelle requise :</strong> Le comptable doit lire et retaper les montants, dates, numéros de facture dans le logiciel.</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                  <span><strong className="text-foreground">Risque d'erreur élevé :</strong> Chaque saisie manuelle introduit un risque de faute de frappe ou d'oubli.</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                  <span><strong className="text-foreground">Pas d'interopérabilité :</strong> Impossible d'échanger automatiquement avec un autre système informatique.</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                  <span><strong className="text-foreground">Non conforme EN 16931 :</strong> Ne respecte pas la norme européenne de facturation électronique.</span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Factur-X : le PDF intelligent
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Factur-X (aussi appelé ZUGFeRD en Allemagne) est un <strong className="text-foreground">
              format hybride</strong> qui combine le meilleur des deux mondes : un PDF lisible par 
              l'humain ET un fichier XML structuré pour les machines.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-semibold text-foreground mb-4">Caractéristiques du Factur-X</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong className="text-foreground">Double format :</strong> Contient un PDF visuel + un fichier XML embarqué (pièce jointe dans le PDF/A-3).</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong className="text-foreground">Données structurées :</strong> Toutes les informations (montants, dates, SIRET, lignes) sont codifiées dans le XML selon la norme EN 16931.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong className="text-foreground">Traitement automatique :</strong> Le logiciel de comptabilité extrait directement les données XML sans intervention humaine.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong className="text-foreground">Interopérable :</strong> Fonctionne avec tous les systèmes européens compatibles (Chorus Pro, ERP, logiciels comptables).</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong className="text-foreground">Conforme réglementation :</strong> Respecte la directive européenne 2014/55/UE et sera obligatoire en France en 2026.</span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Tableau comparatif détaillé
            </h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border border-slate-300 dark:border-slate-700 p-3 text-left font-semibold text-foreground">Critère</th>
                    <th className="border border-slate-300 dark:border-slate-700 p-3 text-center font-semibold text-foreground">PDF classique</th>
                    <th className="border border-slate-300 dark:border-slate-700 p-3 text-center font-semibold text-foreground">Factur-X</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 font-semibold text-foreground">Lisibilité humaine</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">✅ Oui</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">✅ Oui</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <td className="border border-slate-300 dark:border-slate-700 p-3 font-semibold text-foreground">Données structurées</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">❌ Non</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">✅ XML EN 16931</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 font-semibold text-foreground">Saisie automatique</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">❌ Manuelle (OCR parfois)</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">✅ 100% automatique</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <td className="border border-slate-300 dark:border-slate-700 p-3 font-semibold text-foreground">Temps de traitement</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">5-10 min/facture</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">&lt; 10 secondes</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 font-semibold text-foreground">Risque d'erreur</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">⚠️ Élevé (saisie humaine)</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">✅ Minimal (automatique)</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <td className="border border-slate-300 dark:border-slate-700 p-3 font-semibold text-foreground">Conformité légale 2026</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">❌ Non conforme</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">✅ Conforme EN 16931</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 font-semibold text-foreground">Intégration ERP</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">❌ Manuelle ou OCR</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">✅ API native</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <td className="border border-slate-300 dark:border-slate-700 p-3 font-semibold text-foreground">Chorus Pro</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">⚠️ Accepté mais ressaisie</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">✅ Import direct</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 font-semibold text-foreground">Archivage légal</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">⚠️ PDF/A requis</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">✅ PDF/A-3 intégré</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <td className="border border-slate-300 dark:border-slate-700 p-3 font-semibold text-foreground">Coût de traitement</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">💰💰💰 Élevé</td>
                    <td className="border border-slate-300 dark:border-slate-700 p-3 text-center text-muted-foreground">💰 Faible</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Pourquoi un PDF seul ne suffit plus ?
            </h2>
            
            <div className="space-y-6 mb-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">1. Obligation légale en 2026</h3>
                    <p className="text-muted-foreground">
                      À partir du <strong className="text-foreground">1er septembre 2026</strong>, toutes 
                      les entreprises françaises devront émettre et recevoir des factures électroniques 
                      structurées. Le simple PDF ne sera plus accepté pour les transactions B2B. Les 
                      entreprises non conformes risquent des <strong className="text-foreground">amendes 
                      jusqu'à 15 000 €</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">2. Perte de compétitivité</h3>
                    <p className="text-muted-foreground">
                      Les entreprises qui traiteront manuellement leurs factures PDF perdront un temps 
                      considérable face à leurs concurrents automatisés. <strong className="text-foreground">
                      5-10 minutes par facture</strong> × 100 factures/mois = 8 à 16 heures de travail 
                      répétitif qui pourrait être éliminé.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">3. Coût de traitement élevé</h3>
                    <p className="text-muted-foreground">
                      Le traitement manuel d'un PDF coûte en moyenne <strong className="text-foreground">
                      5-7 € par facture</strong> (temps employé, risque d'erreur, relances). Avec Factur-X, 
                      ce coût tombe à <strong className="text-foreground">moins de 0,50 €</strong>. Sur 1000 
                      factures/an, c'est une économie de 6 500 €.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Les avantages concrets de Factur-X
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 dark:border-sky-900 dark:bg-sky-900/20">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-sky-600" />
                  Automatisation
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Saisie automatique dans le logiciel comptable</li>
                  <li>• Rapprochement bancaire automatisé</li>
                  <li>• Validation des données en temps réel</li>
                  <li>• Workflow d'approbation digitalisé</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-900/20">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Sécurité & Conformité
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Traçabilité complète des échanges</li>
                  <li>• Archivage légal garanti (PDF/A-3)</li>
                  <li>• Signature électronique intégrée</li>
                  <li>• Piste d'audit fiable</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-900 dark:bg-purple-900/20">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Économies
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Réduction des coûts de traitement de 80-90%</li>
                  <li>• Moins d'erreurs = moins de litiges</li>
                  <li>• Délai de paiement réduit (J+15 vs J+30)</li>
                  <li>• Optimisation de la trésorerie</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-900 dark:bg-orange-900/20">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  Productivité
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Traitement 60x plus rapide</li>
                  <li>• Libération du temps comptable</li>
                  <li>• Recentrage sur les tâches à valeur ajoutée</li>
                  <li>• Satisfaction client améliorée</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Sécurité et archivage : PDF vs Factur-X
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              La conservation des factures est une obligation légale de <strong className="text-foreground">
              10 ans minimum</strong>. Voici comment les deux formats se comparent :
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-semibold text-foreground mb-4">PDF classique</h3>
              <p className="text-muted-foreground mb-4">
                Un PDF standard peut se dégrader avec le temps (polices manquantes, couleurs altérées). 
                Pour l'archivage légal, il faut le convertir en <strong className="text-foreground">
                PDF/A-1 ou PDF/A-2</strong>, ce qui nécessite un logiciel dédié. De plus, le PDF seul 
                ne garantit pas l'intégrité des données : un montant peut être modifié manuellement sans 
                laisser de trace visible.
              </p>
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-900/20">
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-0">
                  ⚠️ <strong>Attention :</strong> Un PDF non signé électroniquement n'a aucune valeur 
                  probante en cas de litige fiscal.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-semibold text-foreground mb-4">Factur-X (PDF/A-3 + XML)</h3>
              <p className="text-muted-foreground mb-4">
                Le format <strong className="text-foreground">PDF/A-3</strong> est conçu spécifiquement 
                pour l'archivage à long terme. Il embarque toutes les polices et ressources nécessaires 
                à son affichage futur. Le fichier XML signé garantit l'intégrité des données : toute 
                modification est détectable. La signature électronique (eIDAS) peut être ajoutée pour 
                une valeur légale maximale.
              </p>
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
                <p className="text-sm text-green-800 dark:text-green-200 mb-0">
                  ✅ <strong>Avantage :</strong> Factur-X répond à toutes les exigences de conservation 
                  légale sans traitement supplémentaire.
                </p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Exemple concret de coût
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Prenons l'exemple d'une PME de 50 employés qui traite 200 factures fournisseurs et émet 
              300 factures clients par mois :
            </p>

            <div className="overflow-x-auto mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
                  <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4">
                    Avec PDF classique
                  </h3>
                  <div className="space-y-3 text-sm text-red-800 dark:text-red-200">
                    <div className="flex justify-between">
                      <span>Temps de traitement/facture :</span>
                      <span className="font-semibold">8 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>500 factures × 8 min :</span>
                      <span className="font-semibold">66,7 heures/mois</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coût horaire comptable :</span>
                      <span className="font-semibold">35 €/h</span>
                    </div>
                    <div className="flex justify-between border-t border-red-300 dark:border-red-800 pt-2 mt-2">
                      <span className="font-bold">Coût mensuel :</span>
                      <span className="font-bold text-lg">2 334 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Coût annuel :</span>
                      <span className="font-bold text-xl">28 008 €</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-red-300 dark:border-red-800">
                      <p className="text-xs">+ Erreurs, litiges, retards de paiement...</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-900/20">
                  <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">
                    Avec Factur-X
                  </h3>
                  <div className="space-y-3 text-sm text-green-800 dark:text-green-200">
                    <div className="flex justify-between">
                      <span>Temps de traitement/facture :</span>
                      <span className="font-semibold">30 sec (contrôle)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>500 factures × 30 sec :</span>
                      <span className="font-semibold">4,2 heures/mois</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coût horaire comptable :</span>
                      <span className="font-semibold">35 €/h</span>
                    </div>
                    <div className="flex justify-between border-t border-green-300 dark:border-green-800 pt-2 mt-2">
                      <span className="font-bold">Coût mensuel :</span>
                      <span className="font-bold text-lg">147 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Coût annuel :</span>
                      <span className="font-bold text-xl">1 764 €</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-300 dark:border-green-800">
                      <p className="text-xs font-bold">💰 Économie annuelle : 26 244 €</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 md:p-8 mb-8 dark:border-sky-900 dark:bg-sky-900/20">
              <p className="text-lg font-semibold text-sky-900 dark:text-sky-100 mb-3">
                📊 ROI immédiat
              </p>
              <p className="text-sky-800 dark:text-sky-200 mb-0">
                Même en comptant l'investissement dans une solution Factur-X (environ 1 000-2 000 € de 
                mise en place + 100-200 €/mois d'abonnement), le <strong>retour sur investissement est 
                atteint en moins de 2 mois</strong>. Ensuite, ce sont des économies nettes chaque mois.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-purple-50 to-sky-50 p-8 md:p-10 text-center my-12 dark:border-slate-800 dark:from-purple-900/20 dark:to-sky-900/20">
              <h3 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-4">
                Prêt à passer à Factur-X ?
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Convertissez vos PDF en Factur-X en quelques clics. Testez gratuitement avec 3 crédits 
                offerts, sans carte bancaire.
              </p>
              <Link href="/auth">
                <Button size="lg" className="rounded-2xl">
                  Convertir mes factures
                </Button>
              </Link>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Conclusion
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              La différence entre une facture PDF et une facture électronique Factur-X n'est pas qu'une 
              question de format technique : c'est un <strong className="text-foreground">changement de 
              paradigme</strong> dans la gestion comptable. Le PDF classique est un document figé, conçu 
              pour être lu par un humain. Factur-X est un document intelligent, conçu pour être traité 
              automatiquement tout en restant lisible.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Avec l'obligation légale qui arrive en septembre 2026, la question n'est plus de savoir 
              <em>si</em> vous devez passer à Factur-X, mais <em>quand</em>. Plus tôt vous ferez la 
              transition, plus vite vous bénéficierez des gains de productivité et des économies. 
              N'attendez pas le dernier moment : commencez dès aujourd'hui à convertir vos PDF en 
              Factur-X avec notre solution simple et abordable.
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
