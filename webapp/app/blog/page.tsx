import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Factur-X - Guides & Actualités Facturation Électronique",
  description:
    "Guides complets sur la facturation électronique, Factur-X, obligation 2026, norme EN 16931 et Chorus Pro. Conseils d'experts pour réussir votre transition.",
  keywords: [
    "blog facturation électronique",
    "guide Factur-X",
    "actualités EN 16931",
    "obligation 2026",
    "tutoriels facture électronique"
  ],
};

const articles = [
  {
    slug: "facturation-electronique-obligatoire-2026",
    title: "Facturation électronique obligatoire en 2026 : ce qui change",
    excerpt: "Découvrez les nouvelles obligations de facturation électronique qui entreront en vigueur en 2026 pour toutes les entreprises françaises.",
    date: "19 janvier 2026",
    readTime: "8 min",
    category: "Réglementation",
  },
  {
    slug: "quest-ce-que-factur-x-guide-complet",
    title: "Qu'est-ce que Factur-X ? Guide complet 2026",
    excerpt: "Tout savoir sur le format Factur-X (ZUGFeRD) : définition, avantages, norme EN 16931, et pourquoi c'est le futur de la facturation B2B.",
    date: "19 janvier 2026",
    readTime: "10 min",
    category: "Guide",
  },
  {
    slug: "convertir-pdf-facturx-3-clics",
    title: "Comment convertir un PDF en Factur-X en 3 clics",
    excerpt: "Tutoriel pas à pas pour transformer vos factures PDF classiques en factures électroniques Factur-X conformes à la norme EN 16931.",
    date: "19 janvier 2026",
    readTime: "5 min",
    category: "Tutoriel",
  },
  {
    slug: "difference-facture-pdf-facture-electronique",
    title: "Différence entre facture PDF et facture électronique Factur-X",
    excerpt: "Comprendre les différences fondamentales entre un simple PDF et une véritable facture électronique structurée au format Factur-X.",
    date: "19 janvier 2026",
    readTime: "6 min",
    category: "Comparatif",
  },
  {
    slug: "checklist-preparer-entreprise-facturation-electronique",
    title: "Checklist : Préparer son entreprise à la facturation électronique",
    excerpt: "Liste complète des actions à mener pour être prêt avant l'échéance de septembre 2026. Logiciels, processus, formation de vos équipes.",
    date: "19 janvier 2026",
    readTime: "7 min",
    category: "Checklist",
  },
];

const categoryColors: Record<string, string> = {
  "Réglementation": "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  "Guide": "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
  "Tutoriel": "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  "Comparatif": "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  "Checklist": "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function BlogPage() {
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
              <p className="hidden sm:block text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Blog & Guides
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/">
              <Button variant="ghost" className="px-3 md:px-4 text-sm">
                Accueil
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
        <section className="bg-gradient-to-br from-primary/5 to-sky-100/30 py-16 md:py-20 dark:from-primary/10 dark:to-sky-900/20">
          <div className="mx-auto max-w-6xl px-4 md:px-6 text-center">
            <div className="mb-4 md:mb-6 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
              </span>
              Blog & Actualités
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white">
              Guides et actualités
              <span className="ml-2 inline bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">
                Factur-X
              </span>
            </h1>
            <p className="mx-auto mt-4 md:mt-6 max-w-3xl text-base md:text-lg lg:text-xl text-muted-foreground">
              Découvrez nos guides complets sur la facturation électronique, la norme EN 16931, 
              et préparez votre entreprise à l'obligation 2026.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group"
                >
                  <article className="h-full rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-xl hover:border-primary/20 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${categoryColors[article.category]}`}>
                        {article.category}
                      </span>
                    </div>
                    
                    <h2 className="text-xl md:text-2xl font-display font-bold text-primary dark:text-white mb-3 group-hover:text-sky-500 transition-colors">
                      {article.title}
                    </h2>
                    
                    <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-sky-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary to-slate-900 py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-4 md:px-6 text-center text-white">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold">
              Prêt à convertir vos factures en Factur-X ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-white/80">
              Testez notre solution gratuitement avec 3 crédits offerts chaque mois.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto rounded-2xl bg-white text-primary hover:bg-white/90">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-2xl border-white/30 text-white hover:bg-white/10">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </section>
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
