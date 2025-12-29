import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, FileText, Shield, Zap, Download, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Factur-X Convert</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tarifs
            </Link>
            <Link href="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Button variant="outline">Se connecter</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
            Convertissez vos factures PDF au format Factur-X
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 leading-relaxed">
            Solution professionnelle et conforme pour transformer vos factures PDF en format Factur-X (ZUGFeRD).
            Extraction automatique par OCR, validation complète, et conformité garantie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="text-base px-8">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="text-base px-8 bg-transparent">
                Voir les tarifs
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Aucune carte bancaire requise • 10 conversions offertes</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-lg text-muted-foreground">
              Une solution complète pour la conversion de factures conformes aux normes européennes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Extraction automatique</h3>
              <p className="text-muted-foreground">
                OCR avancé pour extraire automatiquement les données de vos factures scannées ou numériques.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Conformité garantie</h3>
              <p className="text-muted-foreground">
                Validation complète PDF/A-3, XML CII, et Factur-X. Conforme aux réglementations françaises.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Vérification manuelle</h3>
              <p className="text-muted-foreground">
                Interface de vérification avec scores de confiance pour valider les données extraites.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Traitement par lot</h3>
              <p className="text-muted-foreground">
                Importez plusieurs factures ou des archives ZIP pour un traitement en masse.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Exports multiples</h3>
              <p className="text-muted-foreground">
                Téléchargez vos fichiers Factur-X, XML CII, et rapports de validation.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Historique complet</h3>
              <p className="text-muted-foreground">
                Accédez à l'historique de toutes vos conversions avec recherche et filtres.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tarifs simples et transparents</h2>
            <p className="text-lg text-muted-foreground">Choisissez la formule adaptée à vos besoins</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-card rounded-lg p-8 border border-border">
              <h3 className="font-semibold text-xl mb-2">Starter</h3>
              <p className="text-muted-foreground text-sm mb-6">Pour débuter</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">0€</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">10 conversions offertes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Extraction OCR</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Validation complète</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Support email</span>
                </li>
              </ul>
              <Link href="/auth" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Commencer
                </Button>
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-card rounded-lg p-8 border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Populaire
              </div>
              <h3 className="font-semibold text-xl mb-2">Professionnel</h3>
              <p className="text-muted-foreground text-sm mb-6">Pour les cabinets</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">49€</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">500 conversions/mois</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Traitement par lot</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">API disponible</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Support prioritaire</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Gestion multi-utilisateurs</span>
                </li>
              </ul>
              <Link href="/auth" className="block">
                <Button className="w-full">Choisir ce plan</Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-card rounded-lg p-8 border border-border">
              <h3 className="font-semibold text-xl mb-2">Enterprise</h3>
              <p className="text-muted-foreground text-sm mb-6">Pour les grandes entreprises</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">Sur mesure</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Conversions illimitées</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Déploiement on-premise</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">SLA garanti</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Support dédié 24/7</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Intégration ERP</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full bg-transparent">
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à commencer ?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Créez votre compte gratuitement et bénéficiez de 10 conversions offertes
            </p>
            <Link href="/auth">
              <Button size="lg" className="text-base px-8">
                Créer un compte gratuit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">Factur-X Convert</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Factur-X Convert. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
