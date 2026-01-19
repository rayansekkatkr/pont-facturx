import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Facturation électronique obligatoire en 2026 : ce qui change | Blog Factur-X",
  description:
    "Tout savoir sur l'obligation de facturation électronique en France à partir de septembre 2026. Calendrier, sanctions, entreprises concernées, solutions conformes.",
  keywords: [
    "facturation électronique obligatoire",
    "obligation 2026",
    "réforme facturation France",
    "Chorus Pro",
    "sanctions facturation électronique",
    "calendrier 2026 2027"
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
            <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-600 dark:bg-red-900/30 dark:text-red-400 mb-4">
              Réglementation
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white mb-6">
              Facturation électronique obligatoire en 2026 : ce qui change pour votre entreprise
            </h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                19 janvier 2026
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                8 min de lecture
              </span>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 md:p-8 mb-8 dark:border-sky-900 dark:bg-sky-900/20">
              <p className="text-lg font-semibold text-sky-900 dark:text-sky-100 mb-3">
                📌 En bref
              </p>
              <p className="text-sky-800 dark:text-sky-200 mb-0">
                À partir de septembre 2026, toutes les entreprises françaises assujetties à la TVA devront 
                être en mesure de recevoir et émettre des factures électroniques. Cette réforme majeure 
                vise à moderniser la fiscalité et à lutter contre la fraude à la TVA.
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Qu'est-ce que la réforme de la facturation électronique ?
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              La réforme de la facturation électronique obligatoire est une initiative du gouvernement français 
              visant à digitaliser l'ensemble des échanges de factures entre entreprises (B2B). Inscrite dans 
              la loi de finances 2020, elle s'aligne sur la directive européenne 2014/55/UE et transforme 
              en profondeur les pratiques commerciales françaises.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Contrairement à une simple numérisation (scanner un PDF), la facturation électronique implique 
              l'utilisation de <strong className="text-foreground">données structurées au format XML</strong>, 
              permettant un traitement automatisé par les logiciels de comptabilité et l'administration fiscale.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Calendrier de déploiement 2026-2027
            </h2>
            <div className="space-y-4 mb-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-sky-500" />
                  1er septembre 2026 : Réception obligatoire
                </h3>
                <p className="text-muted-foreground">
                  <strong>Toutes les entreprises</strong> (grandes, ETI, PME, TPE, micro-entreprises) doivent 
                  être capables de recevoir des factures électroniques via une plateforme de dématérialisation 
                  partenaire (PDP) ou le Portail Public de Facturation (PPF).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-500" />
                  1er septembre 2026 : Émission pour les grandes entreprises et ETI
                </h3>
                <p className="text-muted-foreground">
                  Les <strong>grandes entreprises</strong> (+ de 5000 salariés ou + de 1,5 Md€ de CA) et 
                  les <strong>ETI</strong> (250 à 5000 salariés) doivent commencer à émettre leurs factures 
                  au format électronique.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  1er septembre 2027 : Émission pour les PME et micro-entreprises
                </h3>
                <p className="text-muted-foreground">
                  Les <strong>PME</strong> (10 à 250 salariés), <strong>TPE</strong> et 
                  <strong> micro-entreprises</strong> devront à leur tour émettre des factures électroniques. 
                  Ce délai supplémentaire leur permet de s'équiper progressivement.
                </p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Quelles entreprises sont concernées ?
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              <strong className="text-foreground">Toutes les entreprises assujetties à la TVA en France</strong> 
              sont concernées, quelle que soit leur taille :
            </p>
            <ul className="space-y-3 text-lg text-muted-foreground mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                <span>Sociétés (SARL, SAS, SA, SCI, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                <span>Entreprises individuelles (EI, EIRL)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                <span>Auto-entrepreneurs et micro-entrepreneurs</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                <span>Professions libérales (avocats, médecins, architectes, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                <span>Associations assujetties à la TVA</span>
              </li>
            </ul>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Seules les transactions B2B (entreprise à entreprise) sont concernées. 
              Les factures B2C (vers les particuliers) restent exemptées pour le moment.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Quels sont les formats acceptés ?
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              L'administration française accepte plusieurs formats de factures électroniques conformes à la 
              <strong className="text-foreground"> norme européenne EN 16931</strong> :
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-foreground mb-2">✅ Factur-X (ZUGFeRD)</h3>
                <p className="text-sm text-muted-foreground">
                  Format hybride PDF/A-3 + XML. Le plus populaire en France et Allemagne. Lisible par 
                  l'humain (PDF) et traitable par machine (XML).
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-foreground mb-2">✅ UBL (Universal Business Language)</h3>
                <p className="text-sm text-muted-foreground">
                  Format XML pur développé par OASIS. Très utilisé en Europe du Nord. 
                  Nécessite un lecteur spécifique.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-foreground mb-2">✅ CII (Cross Industry Invoice)</h3>
                <p className="text-sm text-muted-foreground">
                  Format XML développé par l'ONU. Base technique de Factur-X. 
                  Utilisé pour les échanges internationaux.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-foreground mb-2">❌ PDF simple (non accepté)</h3>
                <p className="text-sm text-muted-foreground">
                  Un PDF classique sans données structurées ne sera plus valable pour les 
                  transactions B2B après septembre 2026.
                </p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Quelles sanctions en cas de non-conformité ?
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Le non-respect de l'obligation de facturation électronique expose les entreprises à des 
              <strong className="text-foreground"> sanctions fiscales</strong> :
            </p>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 md:p-8 mb-8 dark:border-red-900 dark:bg-red-900/20">
              <ul className="space-y-3 text-red-900 dark:text-red-100 mb-0">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 dark:text-red-400 font-bold">⚠️</span>
                  <span><strong>Amende de 15€ par facture non conforme</strong> (plafonnée à 15 000€ par an)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 dark:text-red-400 font-bold">⚠️</span>
                  <span><strong>Rejet de la déduction de TVA</strong> pour le client (facture non valable)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 dark:text-red-400 font-bold">⚠️</span>
                  <span><strong>Contrôle fiscal renforcé</strong> en cas de manquements répétés</span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Comment se préparer dès maintenant ?
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Voici les <strong className="text-foreground">5 actions prioritaires</strong> pour anticiper 
              la réforme :
            </p>
            <ol className="space-y-4 text-lg text-muted-foreground mb-8">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-sky-100 text-sky-600 font-bold text-sm dark:bg-sky-900/30 dark:text-sky-400">1</span>
                <div>
                  <strong className="text-foreground">Auditer votre processus de facturation actuel</strong>
                  <p className="mt-1">Identifiez les volumes, les fournisseurs, les logiciels utilisés, 
                  les délais de traitement. Cartographiez vos flux.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-sky-100 text-sky-600 font-bold text-sm dark:bg-sky-900/30 dark:text-sky-400">2</span>
                <div>
                  <strong className="text-foreground">Choisir une solution de conversion Factur-X</strong>
                  <p className="mt-1">Optez pour un outil comme Factur-X Convert pour transformer 
                  automatiquement vos PDF en factures électroniques conformes EN 16931.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-sky-100 text-sky-600 font-bold text-sm dark:bg-sky-900/30 dark:text-sky-400">3</span>
                <div>
                  <strong className="text-foreground">Mettre à jour votre logiciel de comptabilité</strong>
                  <p className="mt-1">Vérifiez que votre ERP/logiciel comptable peut lire et émettre 
                  des factures Factur-X. Sinon, changez de solution ou ajoutez un connecteur.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-sky-100 text-sky-600 font-bold text-sm dark:bg-sky-900/30 dark:text-sky-400">4</span>
                <div>
                  <strong className="text-foreground">Former vos équipes comptables et commerciales</strong>
                  <p className="mt-1">Sensibilisez vos collaborateurs aux nouveaux formats, aux 
                  obligations légales, et aux bénéfices de l'automatisation.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-sky-100 text-sky-600 font-bold text-sm dark:bg-sky-900/30 dark:text-sky-400">5</span>
                <div>
                  <strong className="text-foreground">Tester avec vos principaux fournisseurs et clients</strong>
                  <p className="mt-1">Réalisez des tests d'envoi/réception de factures Factur-X avec 
                  vos partenaires clés avant l'échéance pour éviter les mauvaises surprises.</p>
                </div>
              </li>
            </ol>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-primary/5 to-sky-100/30 p-8 md:p-10 text-center my-12 dark:border-slate-800 dark:from-primary/10 dark:to-sky-900/20">
              <h3 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-4">
                Convertissez vos factures PDF en Factur-X dès maintenant
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Notre solution OCR automatique transforme vos PDF classiques en factures électroniques 
                conformes EN 16931 en moins de 5 secondes. Essayez gratuitement avec 3 crédits offerts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth">
                  <Button size="lg" className="rounded-2xl">
                    Essayer gratuitement
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline" className="rounded-2xl">
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Conclusion
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              La réforme de la facturation électronique obligatoire en 2026 représente un changement majeur 
              pour toutes les entreprises françaises. Bien préparée, cette transition offre de nombreux 
              avantages : réduction des coûts, automatisation des processus, paiements plus rapides, 
              et conformité fiscale renforcée.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Il est essentiel de commencer dès maintenant à auditer vos processus, choisir les bonnes 
              solutions techniques (comme Factur-X), et former vos équipes. Les entreprises qui 
              anticipent cette transformation en tireront un avantage concurrentiel décisif.
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
