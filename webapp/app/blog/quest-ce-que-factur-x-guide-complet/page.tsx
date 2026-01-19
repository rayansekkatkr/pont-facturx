import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, ArrowLeft, CheckCircle2, Layers } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qu'est-ce que Factur-X ? Guide complet 2026 | Blog Factur-X Convert",
  description:
    "Découvrez le format Factur-X (ZUGFeRD) : définition, fonctionnement, avantages, norme EN 16931, différence avec PDF et XML. Guide complet pour entreprises.",
  keywords: [
    "Factur-X",
    "ZUGFeRD",
    "PDF/A-3",
    "XML CII",
    "norme EN 16931",
    "facture hybride",
    "format facture électronique"
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
            <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-600 dark:bg-sky-900/30 dark:text-sky-400 mb-4">
              Guide
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white mb-6">
              Qu'est-ce que Factur-X ? Guide complet du format de facturation électronique
            </h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                19 janvier 2026
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                10 min de lecture
              </span>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 md:p-8 mb-8 dark:border-sky-900 dark:bg-sky-900/20">
              <p className="text-lg font-semibold text-sky-900 dark:text-sky-100 mb-3">
                📌 En bref
              </p>
              <p className="text-sky-800 dark:text-sky-200 mb-0">
                Factur-X est un format de facture électronique hybride combinant un PDF lisible par l'humain 
                et des données XML structurées conformes à la norme EN 16931. Également appelé ZUGFeRD en Allemagne, 
                c'est le standard européen de référence pour la facturation B2B.
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Définition : Qu'est-ce que Factur-X ?
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              <strong className="text-foreground">Factur-X</strong> est un format de facture électronique 
              <strong className="text-foreground"> hybride</strong> qui combine deux composantes :
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">1. Un PDF/A-3</h3>
                </div>
                <p className="text-muted-foreground">
                  Document visuel classique, lisible par l'humain. Conserve la présentation graphique habituelle 
                  (logo, mise en page, couleurs). Format d'archivage à long terme (PDF/A).
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/30">
                    <Layers className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">2. Un fichier XML</h3>
                </div>
                <p className="text-muted-foreground">
                  Données structurées embarquées dans le PDF. Conforme à la norme EN 16931 (CII ou UBL). 
                  Traitable automatiquement par les logiciels de comptabilité.
                </p>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Cette <strong className="text-foreground">double couche</strong> permet une transition en douceur 
              vers la facturation électronique : les utilisateurs continuent à visualiser leurs factures au 
              format PDF tout en bénéficiant de l'automatisation permise par les données XML.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Historique : D'où vient Factur-X ?
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Factur-X est né d'une <strong className="text-foreground">collaboration franco-allemande</strong> 
              entre le Forum National de la Facture Électronique (FNFE-MPE) en France et l'association FeRD en Allemagne.
            </p>
            <ul className="space-y-3 text-lg text-muted-foreground mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                <span><strong className="text-foreground">2014</strong> : Lancement du format ZUGFeRD en Allemagne (version 1.0)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                <span><strong className="text-foreground">2017</strong> : Adaptation française sous le nom Factur-X (version 1.0)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                <span><strong className="text-foreground">2020</strong> : Harmonisation avec la norme européenne EN 16931 (version 2.0)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                <span><strong className="text-foreground">2024</strong> : Version 2.1 avec support étendu des cas d'usage</span>
              </li>
            </ul>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Aujourd'hui, Factur-X/ZUGFeRD est le format le plus répandu en Europe continentale, utilisé par 
              des millions d'entreprises en France, Allemagne, Belgique, Suisse et Luxembourg.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Comment fonctionne techniquement Factur-X ?
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Un fichier Factur-X est un <strong className="text-foreground">PDF/A-3</strong> qui contient 
              un fichier XML en pièce jointe invisible. Voici la structure technique :
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8 mb-8 dark:border-slate-800 dark:bg-slate-900/50">
              <pre className="text-sm font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
{`facture.pdf (PDF/A-3)
├── Couche visuelle (PDF)
│   ├── Logo de l'entreprise
│   ├── Mise en page graphique
│   ├── Texte formaté
│   └── Tableau des lignes de facture
│
└── Pièce jointe XML (factur-x.xml)
    ├── <ExchangedDocument>
    │   ├── ID: INV-2026-001
    │   ├── TypeCode: 380
    │   └── IssueDateTime: 2026-01-19
    ├── <SupplyChainTradeTransaction>
    │   ├── SellerTradeParty (émetteur)
    │   ├── BuyerTradeParty (destinataire)
    │   └── ApplicableTradeTax (TVA)
    └── <SpecifiedTradeSettlementMonetarySummation>
        ├── TaxBasisTotalAmount: 1000.00
        ├── TaxTotalAmount: 200.00
        └── GrandTotalAmount: 1200.00`}
              </pre>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Le fichier XML suit la syntaxe <strong className="text-foreground">UN/CEFACT CII</strong> 
              (Cross Industry Invoice) et respecte le modèle sémantique de la norme EN 16931. Les logiciels 
              de comptabilité lisent automatiquement ce XML pour extraire les données.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Les 6 profils Factur-X
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Factur-X propose plusieurs <strong className="text-foreground">niveaux de complexité</strong> 
              (profils) selon les besoins métier :
            </p>
            <div className="space-y-4 mb-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-foreground mb-2">1. MINIMUM</h3>
                <p className="text-muted-foreground text-sm">
                  Données minimales (émetteur, destinataire, montant total). Idéal pour les TPE/auto-entrepreneurs.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-foreground mb-2">2. BASIC WL (Without Lines)</h3>
                <p className="text-muted-foreground text-sm">
                  Infos de facturation complètes mais sans détail des lignes. Pour les factures simples.
                </p>
              </div>
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 dark:border-sky-800 dark:bg-sky-900/20">
                <h3 className="text-lg font-semibold text-sky-900 dark:text-sky-100 mb-2">3. BASIC ⭐ (Recommandé)</h3>
                <p className="text-sky-800 dark:text-sky-200 text-sm">
                  Détail complet avec lignes de facture. Conforme EN 16931. Le plus utilisé en France.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-foreground mb-2">4. EN 16931</h3>
                <p className="text-muted-foreground text-sm">
                  100% des champs obligatoires et optionnels de la norme européenne. Pour les grandes entreprises.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-foreground mb-2">5. EXTENDED</h3>
                <p className="text-muted-foreground text-sm">
                  Données métier avancées (logistique, transport, garanties). Pour les secteurs spécialisés.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-foreground mb-2">6. XRECHNUNG</h3>
                <p className="text-muted-foreground text-sm">
                  Profil allemand pour les factures au secteur public (B2G). Compatible Chorus Pro en France.
                </p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Quels sont les avantages de Factur-X ?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Pour les entreprises émettrices
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-sky-500 mt-1">✓</span>
                    <span>Réduction des coûts d'envoi (email vs courrier)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-500 mt-1">✓</span>
                    <span>Paiements plus rapides (délais réduits)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-500 mt-1">✓</span>
                    <span>Archivage électronique automatisé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-500 mt-1">✓</span>
                    <span>Traçabilité et horodatage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-500 mt-1">✓</span>
                    <span>Conformité Chorus Pro garantie</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  Pour les entreprises réceptrices
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-sky-500 mt-1">✓</span>
                    <span>Saisie automatique dans le logiciel comptable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-500 mt-1">✓</span>
                    <span>Réduction des erreurs de ressaisie (99.9% précision)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-500 mt-1">✓</span>
                    <span>Rapprochement bancaire simplifié</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-500 mt-1">✓</span>
                    <span>Validation TVA instantanée</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-500 mt-1">✓</span>
                    <span>Gain de temps : 90% plus rapide</span>
                  </li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Factur-X vs autres formats : Quelle différence ?
            </h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Format</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Lisible humain</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Automatisable</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 px-4 font-semibold text-sky-600">Factur-X</td>
                    <td className="py-3 px-4">PDF/A-3 + XML</td>
                    <td className="py-3 px-4 text-green-600">✓ Oui</td>
                    <td className="py-3 px-4 text-green-600">✓ Oui</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 px-4 font-semibold">PDF classique</td>
                    <td className="py-3 px-4">PDF</td>
                    <td className="py-3 px-4 text-green-600">✓ Oui</td>
                    <td className="py-3 px-4 text-red-600">✗ Non</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 px-4 font-semibold">UBL</td>
                    <td className="py-3 px-4">XML pur</td>
                    <td className="py-3 px-4 text-red-600">✗ Non</td>
                    <td className="py-3 px-4 text-green-600">✓ Oui</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 px-4 font-semibold">CII</td>
                    <td className="py-3 px-4">XML pur</td>
                    <td className="py-3 px-4 text-red-600">✗ Non</td>
                    <td className="py-3 px-4 text-green-600">✓ Oui</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              <strong className="text-foreground">Verdict</strong> : Factur-X est le seul format qui combine 
              les avantages du PDF (lisibilité) et du XML (automatisation). C'est pourquoi il est devenu 
              le standard de facto en France et en Allemagne.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-primary/5 to-sky-100/30 p-8 md:p-10 text-center my-12 dark:border-slate-800 dark:from-primary/10 dark:to-sky-900/20">
              <h3 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-4">
                Convertissez vos PDF en Factur-X en 3 clics
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Notre outil OCR extrait automatiquement les données de vos factures PDF et génère 
                un fichier Factur-X conforme EN 16931. Testez gratuitement maintenant.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth">
                  <Button size="lg" className="rounded-2xl">
                    Essayer gratuitement
                  </Button>
                </Link>
                <Link href="/blog/convertir-pdf-facturx-3-clics">
                  <Button size="lg" variant="outline" className="rounded-2xl">
                    Voir le tutoriel
                  </Button>
                </Link>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mt-12 mb-6">
              Conclusion
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Factur-X est bien plus qu'un simple format de fichier : c'est une <strong className="text-foreground">
              révolution dans la gestion de la facturation</strong>. En combinant la familiarité du PDF avec 
              la puissance de l'automatisation XML, il offre une transition en douceur vers l'ère de la 
              facturation électronique obligatoire.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Que vous soyez une micro-entreprise ou un grand groupe, adopter Factur-X dès maintenant vous 
              permettra de réduire vos coûts, accélérer vos paiements, et être en conformité avec les 
              obligations 2026 en toute sérénité.
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
