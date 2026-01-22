import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { PricingSection } from "@/components/landing/pricing-section";
import {
  Archive,
  ArrowRight,
  Bot,
  CheckCircle2,
  FileText,
  Layers,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const heroHighlights = [
  "Sans carte bancaire",
  "3 crédits offerts / mois",
];

const premiumFeatureBullets = [
  "Supporte les PDF scannés haute résolution",
  "Apprentissage automatique par IA",
];

const batchStats = [
  { label: "Temps économisé", value: "90%" },
  { label: "Docs/minute", value: "100+" },
];

const creditPacks = [
  { title: "Pack 20", price: "6.99€ HT", sku: "pack_20" },
  { title: "Pack 100", price: "24.99€ HT", sku: "pack_100" },
  { title: "Pack 500", price: "99.99€ HT", sku: "pack_500" },
];

const subscriptionPlans = [
  {
    title: "Starter",
    description: "Pour les entrepreneurs individuels",
    monthlySku: "starter",
    annualSku: "starter_annual",
    highlight: false,
    perks: ["60 crédits / mois", "Support par email", "Historique 3 mois"],
    monthlyPrice: "9.99€",
    annualPrice: "7.99€",
  },
  {
    title: "Pro",
    description: "Pour les cabinets comptables",
    monthlySku: "pro",
    annualSku: "pro_annual",
    highlight: true,
    perks: [
      "200 crédits / mois",
      "Support prioritaire 24/7",
      "Exports personnalisés",
      "API Access",
    ],
    monthlyPrice: "19.99€",
    annualPrice: "15.99€",
  },
  {
    title: "Business",
    description: "Pour les grandes entreprises",
    monthlySku: "business",
    annualSku: "business_annual",
    highlight: false,
    perks: [
      "500 crédits / mois",
      "Account manager dédié",
      "SLA garanti 99.9%",
    ],
    monthlyPrice: "39.99€",
    annualPrice: "31.99€",
  },
];

export default async function HomePage() {
  const token = (await cookies()).get("pfxt_token")?.value;
  const isAuthed = typeof token === "string" && token.length > 0;

  const primaryCtaHref = isAuthed ? "/dashboard" : "/auth";
  const primaryCtaLabel = isAuthed
    ? "Accéder au dashboard"
    : "Commencer gratuitement";

  const secondaryCtaHref = isAuthed ? "/dashboard" : "/auth";
  const secondaryCtaLabel = isAuthed ? "Mon espace" : "Se connecter";

  const gradientPattern = {
    backgroundImage:
      "radial-gradient(circle at 2px 2px, rgba(15,23,42,0.08) 1px, transparent 0)",
    backgroundSize: "36px 36px",
  } as const;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-background/90">
        <nav className="mx-auto flex h-16 md:h-20 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-primary/10 text-primary">
              <FileText className="h-4 w-4 md:h-5 md:w-5" />
            </span>
            <div>
              <p className="font-display text-base md:text-xl font-semibold text-primary">
                Factur-X <span className="text-sky-500">Convert</span>
              </p>
              <p className="hidden sm:block text-xs uppercase tracking-[0.3em] text-muted-foreground">
                OCR & Conformité
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-6 lg:gap-8 text-sm font-medium text-muted-foreground lg:flex">
            <Link href="#features" className="transition-colors hover:text-foreground">
              Fonctionnalités
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground">
              Tarifs
            </Link>
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Blog
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href={secondaryCtaHref} className="hidden sm:block text-sm font-medium">
              <Button variant="ghost" className="px-3 md:px-4 text-sm">
                {secondaryCtaLabel}
              </Button>
            </Link>
            <Link href={primaryCtaHref}>
              <Button className="rounded-full px-4 md:px-6 text-xs md:text-sm font-semibold shadow-lg shadow-primary/20">
                Essai gratuit
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-16 md:pt-24" style={gradientPattern}>
        <section className="relative min-h-[80vh] md:min-h-[90vh] overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-8 md:gap-12 px-4 md:px-6 py-12 md:py-16 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="text-center lg:text-left">
              <div className="mb-4 md:mb-6 inline-flex items-center gap-2 rounded-full bg-sky-100 px-2.5 py-1 md:px-3 text-[10px] md:text-xs font-bold uppercase tracking-wider text-sky-600">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
                </span>
                Nouveau : OCR intelligent v2.0
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white">
                Convertissez vos factures PDF en
                <span className="ml-2 inline bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">
                  Factur-X
                </span>
              </h1>
              <p className="mt-4 md:mt-6 text-base md:text-lg lg:text-xl text-muted-foreground">
                Solution professionnelle et conforme pour transformer vos factures PDF
                en format structuré Factur-X (ZUGFeRD). Extraction automatique, validation
                et conformité garantie.
              </p>
              <div className="mt-8 md:mt-10 flex flex-col gap-3 md:gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link href={primaryCtaHref}>
                  <Button size="lg" className="w-full rounded-xl md:rounded-2xl px-6 md:px-8 text-sm md:text-base font-semibold sm:w-auto">
                    {primaryCtaLabel}
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-xl md:rounded-2xl border-slate-200 bg-transparent px-6 md:px-8 text-sm md:text-base text-slate-700 hover:bg-slate-100 sm:w-auto"
                  >
                    Voir les tarifs
                  </Button>
                </Link>
              </div>
              <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground lg:justify-start">
                {heroHighlights.map((item) => (
                  <span key={item} className="flex items-center gap-2 text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -top-16 right-0 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />
              <div className="absolute -bottom-16 left-0 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-2xl shadow-primary/10 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                  <div className="flex gap-1">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    conversion_engine.exe
                  </span>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                  <div className="flex-1 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                    <div className="mb-4 flex items-center gap-3 text-sm font-semibold">
                      <FileText className="h-4 w-4 text-rose-500" />
                      facture_042.pdf
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 rounded bg-slate-200" />
                      <div className="h-2 w-3/4 rounded bg-slate-200" />
                      <div className="mt-4 h-10 rounded bg-white" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Sparkles className="h-10 w-10 text-sky-400" />
                    <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-sky-500">
                      Extraction
                    </p>
                  </div>
                  <div className="flex-1 rounded-2xl border border-slate-900 bg-slate-900 p-4 text-white">
                    <div className="mb-4 flex items-center gap-3 text-sm font-semibold">
                      <Layers className="h-4 w-4 text-sky-300" />
                      factur-x.xml
                    </div>
                    <div className="space-y-2 font-mono text-xs text-white/80">
                      <p>&lt;rsm:ExchangedDocument&gt;</p>
                      <p className="pl-4">&lt;ram:ID&gt;INV-042&lt;/ram:ID&gt;</p>
                      <p className="pl-4">&lt;ram:TypeCode&gt;380&lt;/ram:TypeCode&gt;</p>
                      <p>&lt;/rsm:ExchangedDocument&gt;</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex -space-x-3">
                    <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-200" />
                    <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-300" />
                    <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-400" />
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    Validé Chorus Pro
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conformité & Standards Section */}
        <section className="bg-gradient-to-br from-slate-50 to-white py-12 md:py-16 dark:from-slate-900 dark:to-slate-800">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4">
                <CheckCircle2 className="h-3 w-3" />
                100% Conforme
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                Normes & Standards Respectés
              </h2>
              <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-400">
                Notre plateforme respecte toutes les normes européennes et françaises de facturation électronique
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {/* Badge EN 16931 */}
              <div className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 text-center transition-all hover:border-sky-500 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">EN 16931</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Norme européenne</p>
                <div className="mt-3 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-900/30">
                  ✓ Certifié
                </div>
              </div>

              {/* Badge Factur-X */}
              <div className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 text-center transition-all hover:border-sky-500 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/30">
                    <FileText className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Factur-X</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Format hybride</p>
                <div className="mt-3 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-900/30">
                  ✓ Compatible
                </div>
              </div>

              {/* Badge PDF/A-3 */}
              <div className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 text-center transition-all hover:border-sky-500 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                    <Archive className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">PDF/A-3</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Archivage légal</p>
                <div className="mt-3 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-900/30">
                  ✓ Conforme
                </div>
              </div>

              {/* Badge Chorus Pro */}
              <div className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 text-center transition-all hover:border-sky-500 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                    <Sparkles className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Chorus Pro</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Plateforme publique</p>
                <div className="mt-3 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-900/30">
                  ✓ Compatible
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                🔒 Tous nos fichiers sont validés avec les outils officiels de conformité •{" "}
                <Link href="/blog/quest-ce-que-factur-x-guide-complet" className="text-sky-600 hover:underline">
                  En savoir plus sur nos standards
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="bg-white py-16 md:py-24 dark:bg-slate-900/40">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="text-center">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-sky-500">
                Fonctionnalités premium
              </p>
              <h2 className="mt-3 md:mt-4 text-2xl md:text-3xl lg:text-4xl font-display font-bold text-primary dark:text-white">
                Tout ce dont vous avez besoin
              </h2>
              <p className="mx-auto mt-3 md:mt-4 max-w-2xl text-base md:text-lg text-muted-foreground px-4">
                Une solution complète et sécurisée pour la conversion de factures conformes aux normes européennes.
              </p>
            </div>

            <div className="mt-12 md:mt-20 grid items-center gap-10 md:gap-16 md:grid-cols-2">
              <div>
                <div className="mb-4 md:mb-6 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-xl md:rounded-2xl bg-sky-100 text-sky-500">
                  <Zap className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-semibold dark:text-white">
                  Extraction automatique OCR
                </h3>
                <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground">
                  Notre moteur OCR avancé analyse vos factures en millisecondes pour extraire les données critiques (SIRET, TVA, montants) avec une précision de 99.9%.
                </p>
                <ul className="mt-6 md:mt-8 space-y-3 md:space-y-4 text-sm md:text-base text-muted-foreground">
                  {premiumFeatureBullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-sky-500" /> {bullet}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl md:rounded-3xl border border-slate-200 bg-slate-100 p-6 md:p-10 shadow-lg dark:border-slate-800 dark:bg-slate-800">
                <div className="relative mx-auto w-full max-w-md rounded-xl md:rounded-2xl border border-accent/20 bg-white p-4 md:p-6 dark:bg-slate-900">
                  <div className="flex items-center justify-between rounded-xl bg-sky-50 px-4 py-3 text-xs font-semibold text-sky-600">
                    <span>Numéro de facture</span>
                    <span>#INV-2024-001</span>
                  </div>
                  <div className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-xs font-semibold text-indigo-500">
                    SIRET Émetteur — 823 456 789 00012
                  </div>
                  <div className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                    Total HT — 1 250,00 €
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 md:mt-20 grid items-center gap-10 md:gap-16 md:grid-cols-2">
              <div className="order-2 rounded-2xl md:rounded-3xl border border-slate-200 bg-slate-100 p-8 md:p-16 dark:border-slate-800 dark:bg-slate-800 md:order-1">
                <div className="mx-auto flex max-w-sm flex-col items-center gap-4 md:gap-6">
                  <div className="flex gap-3 md:gap-4">
                    {[0, 1, 2].map((offset) => (
                      <div
                        key={offset}
                        className="h-24 w-16 md:h-32 md:w-20 rounded-lg md:rounded-xl border border-slate-200 bg-white p-2 shadow-md dark:border-slate-700 dark:bg-slate-900"
                        style={{ transform: `translateY(${offset * 8}px) scale(${1 - offset * 0.05})` }}
                      >
                        <div className="mb-2 h-1 rounded bg-slate-100" />
                        <div className="h-1 w-2/3 rounded bg-slate-100" />
                      </div>
                    ))}
                  </div>
                  <div className="rounded-full bg-sky-500 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
                    Traitement par lot
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="mb-4 md:mb-6 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-xl md:rounded-2xl bg-blue-100 text-blue-600">
                  <Archive className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-semibold dark:text-white">
                  Traitement par lot massif
                </h3>
                <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground">
                  Importez des archives ZIP contenant des centaines de factures. Notre infrastructure scalable traite vos documents en parallèle pour vous faire gagner un temps précieux.
                </p>
                <div className="mt-8 flex gap-4">
                  {batchStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900"
                    >
                      <p className="text-3xl font-bold text-primary dark:text-sky-400">
                        {stat.value}
                      </p>
                      <p className="text-xs uppercase tracking-tight text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24 dark:bg-slate-900">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="text-center">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-sky-500">
                Conformité & Réglementation
              </p>
              <h2 className="mt-3 md:mt-4 text-2xl md:text-3xl lg:text-4xl font-display font-bold text-primary dark:text-white">
                Qu'est-ce que Factur-X ?
              </h2>
            </div>

            <div className="mt-12 md:mt-16 space-y-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-4">
                  La facturation électronique obligatoire en 2026
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  À partir de septembre 2026, toutes les entreprises françaises devront être en mesure de 
                  <strong className="text-foreground"> recevoir des factures électroniques</strong>. L'émission deviendra obligatoire 
                  progressivement : septembre 2026 pour les grandes entreprises et ETI, puis septembre 2027 pour 
                  les PME et micro-entreprises. Cette réforme s'inscrit dans la directive européenne 
                  <strong className="text-foreground"> 2014/55/UE</strong> et vise à simplifier les échanges B2B.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-4">
                  Factur-X : Le standard franco-allemand de facturation électronique
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">Factur-X</strong> (également appelé ZUGFeRD en Allemagne) 
                  est un format de facture électronique hybride qui combine :
                </p>
                <ul className="space-y-3 text-base md:text-lg text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                    <span>Un <strong className="text-foreground">fichier PDF/A-3</strong> lisible par l'humain (visualisation classique)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0" />
                    <span>Un <strong className="text-foreground">fichier XML structuré</strong> conforme à la norme <strong className="text-foreground">EN 16931</strong> pour le traitement automatisé</span>
                  </li>
                </ul>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mt-4">
                  Cette double couche permet une transition en douceur : les entreprises peuvent continuer à consulter 
                  leurs factures en PDF tout en automatisant leur comptabilité grâce aux données XML structurées.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-4">
                  Les avantages de la facturation électronique
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-sky-500" />
                      Pour votre entreprise
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>Réduction des coûts d'impression et d'envoi</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>Traitement automatique sans ressaisie manuelle</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>Délai de paiement réduit (paiement plus rapide)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>Traçabilité et archivage électronique sécurisé</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Pour l'administration
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Lutte contre la fraude à la TVA</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Collecte automatisée des données fiscales</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Simplification des contrôles fiscaux</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Harmonisation européenne des échanges</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-24 dark:bg-slate-900/40">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-sky-500">
                Questions fréquentes
              </p>
              <h2 className="mt-3 md:mt-4 text-2xl md:text-3xl lg:text-4xl font-display font-bold text-primary dark:text-white">
                Tout savoir sur Factur-X
              </h2>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              <details className="group rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer text-lg font-semibold text-foreground flex items-center justify-between">
                  Quelle est la différence entre un PDF classique et un PDF Factur-X ?
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Un PDF classique est uniquement un document visuel sans données structurées. Un PDF Factur-X 
                  contient un fichier XML embarqué conforme à la norme EN 16931, permettant l'extraction automatique 
                  des données (montants, SIRET, TVA) par les logiciels de comptabilité et la plateforme Chorus Pro.
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer text-lg font-semibold text-foreground flex items-center justify-between">
                  Mon entreprise est-elle concernée par l'obligation de facturation électronique ?
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Oui, toutes les entreprises assujetties à la TVA en France sont concernées. À partir de septembre 2026, 
                  vous devrez pouvoir recevoir des factures électroniques. L'émission sera obligatoire à partir de septembre 2026 
                  (grandes entreprises/ETI) ou septembre 2027 (PME/micro-entreprises).
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer text-lg font-semibold text-foreground flex items-center justify-between">
                  Qu'est-ce que la norme EN 16931 ?
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  La norme EN 16931 est le standard européen de facturation électronique. Elle définit un modèle de données 
                  sémantique commun et des syntaxes (XML, UBL, CII) pour garantir l'interopérabilité des factures 
                  électroniques entre tous les États membres de l'Union Européenne.
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer text-lg font-semibold text-foreground flex items-center justify-between">
                  Comment fonctionne votre service de conversion ?
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Notre moteur OCR intelligent analyse votre facture PDF, extrait automatiquement toutes les données 
                  (numéro de facture, SIRET, montants, dates, TVA), génère le fichier XML conforme EN 16931, 
                  puis l'intègre dans un PDF/A-3 selon le format Factur-X. Le tout en moins de 5 secondes.
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer text-lg font-semibold text-foreground flex items-center justify-between">
                  Mes factures Factur-X sont-elles acceptées sur Chorus Pro ?
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Oui, toutes les factures générées par notre plateforme sont conformes à la norme EN 16931 et acceptées 
                  par Chorus Pro (portail de facturation électronique de l'État français). Nous validons automatiquement 
                  la structure XML et générons un rapport de conformité pour chaque conversion.
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer text-lg font-semibold text-foreground flex items-center justify-between">
                  Que se passe-t-il si l'OCR ne parvient pas à extraire certaines données ?
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Si notre OCR détecte des champs manquants ou incertains, vous pouvez corriger manuellement les données 
                  avant la génération finale du fichier Factur-X. Notre interface intuitive vous permet de vérifier 
                  et d'ajuster tous les champs extraits pour garantir une conformité à 100%.
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer text-lg font-semibold text-foreground flex items-center justify-between">
                  Puis-je intégrer votre solution à mon ERP ou logiciel de comptabilité ?
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Oui, nous proposons une API REST complète pour intégrer notre service de conversion directement 
                  dans vos applications métier (ERP, logiciels de comptabilité, CRM). Documentation et webhooks 
                  disponibles pour les abonnements Pro et Business.
                </p>
              </details>

              <details className="group rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer text-lg font-semibold text-foreground flex items-center justify-between">
                  Mes données sont-elles sécurisées ?
                  <span className="text-sky-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Absolument. Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). 
                  Nous hébergeons nos serveurs en Europe (conformité RGPD) et supprimons automatiquement vos fichiers 
                  après 30 jours. Nous ne revendons jamais vos données et respectons la confidentialité totale.
                </p>
              </details>
            </div>
          </div>
        </section>

        <PricingSection
          subscriptions={subscriptionPlans}
          creditPacks={creditPacks}
        />

        <section className="px-4 md:px-6 py-16 md:py-24">
          <div className="mx-auto max-w-5xl rounded-2xl md:rounded-[3rem] bg-gradient-to-br from-primary to-slate-900 p-8 md:p-12 text-center text-white shadow-2xl">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold">
              Prêt à simplifier votre facturation électronique ?
            </h2>
            <p className="mx-auto mt-3 md:mt-4 max-w-2xl text-sm md:text-base lg:text-lg text-white/80 px-4">
              Créez votre compte gratuitement et bénéficiez de 3 crédits offerts chaque mois. 
              Conformité EN 16931 garantie. Aucune installation requise.
            </p>
            <div className="mt-8 md:mt-10 flex flex-col items-center gap-3 md:gap-4 sm:flex-row sm:justify-center">
              <Link href={primaryCtaHref}>
                <Button size="lg" className="w-full sm:w-auto rounded-xl md:rounded-2xl bg-white text-primary hover:bg-white/90 text-sm md:text-base">
                  Créer mon compte gratuit
                </Button>
              </Link>
              <Link href="mailto:contact@pont-facturx.com">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl md:rounded-2xl border-white/30 text-black hover:bg-white/90 text-sm md:text-base">
                  Contacter un expert
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-10 md:py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 px-4 md:px-6 lg:grid-cols-5">
          <div className="col-span-1 sm:col-span-2">
            <div className="mb-3 md:mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-display text-lg font-semibold text-primary dark:text-white">
                Factur-X <span className="text-sky-500">Convert</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Leader européen de la conversion de documents fiscaux structurés. Simplifiez votre conformité avec notre moteur intelligent.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-foreground">Produit</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-sky-500">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-sky-500">
                  API
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-sky-500">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-foreground">Légal</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/legal/privacy" className="hover:text-sky-500">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-sky-500">
                  CGU
                </Link>
              </li>
              <li>
                <Link href="/legal/mentions" className="hover:text-sky-500">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/legal/security" className="hover:text-sky-500">
                  Sécurité
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-foreground">Support</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Centre d'aide</li>
              <li>Contact</li>
              <li>Statut</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-xs text-muted-foreground md:flex-row dark:border-slate-800">
          <p>© 2026 Factur-X Convert. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Users className="h-4 w-4" />
            <Bot className="h-4 w-4" />
          </div>
        </div>
      </footer>
    </div>
  );
}
