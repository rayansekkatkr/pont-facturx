import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, ArrowLeft, Upload, Sparkles, Download } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment convertir un PDF en Factur-X en 3 clics | Tutoriel Factur-X Convert",
  description:
    "Tutoriel pas à pas pour transformer vos factures PDF classiques en factures électroniques Factur-X conformes EN 16931. Simple, rapide, gratuit.",
  keywords: [
    "convertir PDF Factur-X",
    "tutoriel Factur-X",
    "transformation facture électronique",
    "OCR facture",
    "guide conversion PDF XML"
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
            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-green-600 dark:bg-green-900/30 dark:text-green-400 mb-4">
              Tutoriel
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white mb-6">
              Comment convertir un PDF en Factur-X en 3 clics
            </h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                19 janvier 2026
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                5 min de lecture
              </span>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 md:p-8 mb-8 dark:border-green-900 dark:bg-green-900/20">
              <p className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                🎯 Ce que vous allez apprendre
              </p>
              <p className="text-green-800 dark:text-green-200 mb-0">
                En moins de 5 minutes, vous saurez transformer n'importe quelle facture PDF en fichier 
                Factur-X conforme à la norme EN 16931, prêt à être envoyé sur Chorus Pro ou intégré 
                dans votre logiciel de comptabilité.
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Prérequis
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Avant de commencer, assurez-vous d'avoir :
            </p>
            <ul className="space-y-2 text-lg text-muted-foreground mb-8">
              <li className="flex items-start gap-3">
                <span className="text-sky-500 mt-1">✓</span>
                <span>Une ou plusieurs factures au format <strong className="text-foreground">PDF</strong> (scannées ou générées)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sky-500 mt-1">✓</span>
                <span>Un compte gratuit sur <strong className="text-foreground">Factur-X Convert</strong> (3 crédits offerts/mois)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sky-500 mt-1">✓</span>
                <span>5 minutes de votre temps ⏱️</span>
              </li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Étape 1 : Téléversez votre facture PDF
            </h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 font-bold text-xl dark:bg-sky-900/30">
                  1
                </div>
                <h3 className="text-xl font-semibold text-foreground">Upload de votre facture</h3>
              </div>
              <ol className="space-y-4 text-lg text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-semibold dark:bg-slate-800">a</span>
                  <span>Connectez-vous à votre compte sur <Link href="/auth" className="text-sky-500 hover:underline">Factur-X Convert</Link></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-semibold dark:bg-slate-800">b</span>
                  <span>Cliquez sur le bouton <strong className="text-foreground">"Téléverser une facture"</strong> dans votre dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-semibold dark:bg-slate-800">c</span>
                  <span>Glissez-déposez votre PDF ou cliquez pour le sélectionner depuis votre ordinateur</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-semibold dark:bg-slate-800">d</span>
                  <span>Attendez la fin de l'upload (quelques secondes selon la taille du fichier)</span>
                </li>
              </ol>
              <div className="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-900/20">
                <p className="text-sm text-sky-800 dark:text-sky-200 mb-0">
                  💡 <strong>Astuce :</strong> Vous pouvez uploader plusieurs factures simultanément en 
                  sélectionnant plusieurs fichiers ou en uploadant une archive ZIP.
                </p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Étape 2 : Vérifiez les données extraites par l'OCR
            </h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 font-bold text-xl dark:bg-sky-900/30">
                  2
                </div>
                <h3 className="text-xl font-semibold text-foreground">Validation automatique des données</h3>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Notre moteur OCR intelligent analyse automatiquement votre facture et extrait les données 
                critiques en quelques secondes :
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <p className="font-semibold text-foreground mb-2">📄 Informations générales</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Numéro de facture</li>
                    <li>• Date d'émission</li>
                    <li>• Date d'échéance</li>
                    <li>• Devise (EUR, USD, etc.)</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <p className="font-semibold text-foreground mb-2">🏢 Parties prenantes</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Nom de l'émetteur</li>
                    <li>• SIRET émetteur</li>
                    <li>• Nom du client</li>
                    <li>• SIRET client</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <p className="font-semibold text-foreground mb-2">💰 Montants</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Montant HT</li>
                    <li>• Montant TVA (par taux)</li>
                    <li>• Montant TTC</li>
                    <li>• Lignes de facture détaillées</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <p className="font-semibold text-foreground mb-2">🔍 Données fiscales</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Taux de TVA appliqués</li>
                    <li>• Numéros de TVA intracommunautaire</li>
                    <li>• Code comptable (si présent)</li>
                    <li>• Conditions de paiement</li>
                  </ul>
                </div>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                <strong className="text-foreground">Vérifiez et corrigez</strong> les données si nécessaire. 
                Notre interface vous permet de modifier manuellement n'importe quel champ avant la génération 
                finale du fichier Factur-X.
              </p>
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-900/20">
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-0">
                  ⚠️ <strong>Important :</strong> La qualité de l'OCR dépend de la lisibilité de votre PDF. 
                  Les PDF générés électroniquement donnent de meilleurs résultats que les scans de mauvaise qualité.
                </p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Étape 3 : Téléchargez votre fichier Factur-X
            </h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 font-bold text-xl dark:bg-sky-900/30">
                  3
                </div>
                <h3 className="text-xl font-semibold text-foreground">Génération et téléchargement</h3>
              </div>
              <ol className="space-y-4 text-lg text-muted-foreground mb-6">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-semibold dark:bg-slate-800">a</span>
                  <span>Une fois les données vérifiées, cliquez sur <strong className="text-foreground">"Générer Factur-X"</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-semibold dark:bg-slate-800">b</span>
                  <span>Notre système génère le fichier XML conforme EN 16931 et l'intègre dans un PDF/A-3</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-semibold dark:bg-slate-800">c</span>
                  <span>Vous recevez <strong className="text-foreground">3 fichiers</strong> au format ZIP :</span>
                </li>
              </ol>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl bg-sky-50 p-4 text-center dark:bg-sky-900/20">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-sky-600" />
                  <p className="font-semibold text-foreground text-sm">facture.facturx.pdf</p>
                  <p className="text-xs text-muted-foreground mt-1">Fichier Factur-X final</p>
                </div>
                <div className="rounded-xl bg-green-50 p-4 text-center dark:bg-green-900/20">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="font-semibold text-foreground text-sm">facture.xml</p>
                  <p className="text-xs text-muted-foreground mt-1">Données XML extraites</p>
                </div>
                <div className="rounded-xl bg-purple-50 p-4 text-center dark:bg-purple-900/20">
                  <Download className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-semibold text-foreground text-sm">rapport_validation.pdf</p>
                  <p className="text-xs text-muted-foreground mt-1">Rapport de conformité</p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">
                Téléchargez l'archive ZIP et conservez le fichier <strong className="text-foreground">
                facture.facturx.pdf</strong> pour l'envoi à vos clients ou l'upload sur Chorus Pro.
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Que faire avec votre fichier Factur-X ?
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Une fois votre facture convertie, plusieurs options s'offrent à vous :
            </p>
            <div className="space-y-4 mb-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl font-semibold text-foreground mb-3">📧 Envoi par email</h3>
                <p className="text-muted-foreground">
                  Attachez le fichier <code className="text-sm bg-slate-100 px-2 py-1 rounded dark:bg-slate-800">
                  facture.facturx.pdf</code> à votre email. Votre client pourra le lire comme un PDF normal 
                  ET l'importer automatiquement dans son logiciel de comptabilité.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl font-semibold text-foreground mb-3">🏛️ Upload sur Chorus Pro</h3>
                <p className="text-muted-foreground">
                  Pour les factures au secteur public, connectez-vous à <a href="https://chorus-pro.gouv.fr" 
                  target="_blank" rel="noopener" className="text-sky-500 hover:underline">Chorus Pro</a> et 
                  uploadez votre fichier Factur-X. Il sera accepté automatiquement car conforme EN 16931.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl font-semibold text-foreground mb-3">💼 Import dans votre ERP</h3>
                <p className="text-muted-foreground">
                  La plupart des logiciels de comptabilité modernes (Sage, Cegid, Pennylane, etc.) savent 
                  lire les fichiers Factur-X et extraire automatiquement les données pour créer l'écriture comptable.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl font-semibold text-foreground mb-3">📦 Archivage électronique</h3>
                <p className="text-muted-foreground">
                  Le format PDF/A-3 garantit une conservation à long terme (10 ans minimum requis par la loi). 
                  Stockez vos Factur-X dans votre GED (gestion électronique de documents) ou un service cloud.
                </p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Questions fréquentes
            </h2>
            <div className="space-y-4 mb-8">
              <details className="group rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer text-lg font-semibold text-foreground flex items-center justify-between">
                  Combien de temps prend la conversion ?
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground">
                  En moyenne, une facture de 1-2 pages est convertie en <strong className="text-foreground">
                  moins de 5 secondes</strong>. Le temps varie selon la complexité du PDF et le nombre de lignes.
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer text-lg font-semibold text-foreground flex items-center justify-between">
                  Le fichier Factur-X est-il compatible avec tous les logiciels ?
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground">
                  Oui, car c'est un PDF standard que n'importe quel lecteur peut ouvrir. Les logiciels 
                  compatibles Factur-X extrairont en plus les données XML pour l'automatisation.
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer text-lg font-semibold text-foreground flex items-center justify-between">
                  Puis-je convertir des factures scannées ?
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground">
                  Oui, notre OCR fonctionne aussi sur les PDF scannés. Assurez-vous que la qualité du scan 
                  est bonne (300 DPI minimum) pour une extraction précise des données.
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer text-lg font-semibold text-foreground flex items-center justify-between">
                  Que se passe-t-il si l'OCR se trompe ?
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground">
                  Vous pouvez corriger manuellement toutes les données avant la génération finale. Notre 
                  interface de validation vous permet de vérifier et ajuster chaque champ extrait.
                </p>
              </details>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-green-50 to-sky-50 p-8 md:p-10 text-center my-12 dark:border-slate-800 dark:from-green-900/20 dark:to-sky-900/20">
              <h3 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-4">
                Prêt à essayer ?
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Créez votre compte gratuit et convertissez vos 3 premières factures sans carte bancaire. 
                Aucune installation requise, 100% en ligne.
              </p>
              <Link href="/auth">
                <Button size="lg" className="rounded-2xl">
                  Commencer gratuitement
                </Button>
              </Link>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Conclusion
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Convertir un PDF en Factur-X n'a jamais été aussi simple. En suivant ces 3 étapes 
              (upload, vérification, téléchargement), vous obtenez en quelques clics une facture 
              électronique conforme à la norme EN 16931, prête à être envoyée à vos clients ou 
              uploadée sur Chorus Pro.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Avec l'obligation de facturation électronique qui arrive en septembre 2026, maîtriser 
              ce processus dès maintenant vous fera gagner un temps précieux et évitera tout stress 
              de dernière minute. N'attendez plus, testez notre solution gratuitement !
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
