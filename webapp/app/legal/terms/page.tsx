"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { useState } from "react";

export default function TermsPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        {/* Geometric Pattern Background */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#0EA5E9 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px"
          }}
        />

        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-sky-500/10 p-2 rounded-xl">
                <FileText className="h-5 w-5 text-sky-500" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
                Factur-X <span className="text-sky-500 font-normal">Convert</span>
              </span>
            </Link>
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Retour
            </Link>
          </div>
        </header>

        <main className="relative min-h-screen py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 relative z-10">
            
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-4">
                  Navigation
                </h3>
                <nav className="space-y-1">
                  <a href="#presentation" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    1. Présentation
                  </a>
                  <a href="#acceptation" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    2. Acceptation
                  </a>
                  <a href="#compte" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    3. Création de compte
                  </a>
                  <a href="#description" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    4. Description du service
                  </a>
                  <a href="#tarifs" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    5. Tarifs et paiement
                  </a>
                  <a href="#utilisation" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    6. Utilisation
                  </a>
                  <a href="#garanties" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    7. Garanties
                  </a>
                  <a href="#archivage" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    8. Archivage
                  </a>
                  <a href="#propriete" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    9. Propriété intellectuelle
                  </a>
                  <a href="#contact" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    13. Contact
                  </a>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden p-8 sm:p-12">
              
              {/* Header */}
              <div className="mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-sky-500/10 rounded-2xl mb-6">
                  <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
                  Conditions Générales d&apos;Utilisation
                </h1>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dernière mise à jour : 18 janvier 2026
                </div>
              </div>

              {/* Section 1: Présentation */}
              <section className="mb-12 scroll-mt-24" id="presentation">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    1
                  </span>
                  Présentation du service
                </h2>
                <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    Factur-X Convert (ci-après &quot;le Service&quot;) est une plateforme de conversion de factures PDF au format Factur-X, 
                    opérée par Rayan Sekkat (ci-après &quot;nous&quot;, &quot;notre&quot;), immatriculée sous le numéro SIRET 98009976600019, 
                    dont le siège social est situé à 8 allée du pré.
                  </p>
                  <p>
                    Le Service permet aux utilisateurs de convertir leurs factures PDF classiques en factures électroniques 
                    structurées au format Factur-X (norme EN 16931), conformes à la réglementation française et européenne 
                    en matière de facturation électronique.
                  </p>
                </div>
              </section>

              {/* Section 2: Acceptation */}
              <section className="mb-12 scroll-mt-24" id="acceptation">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    2
                  </span>
                  Acceptation des conditions
                </h2>
                <div className="space-y-4">
                  <div className="p-6 bg-sky-50 dark:bg-sky-500/5 border-l-4 border-sky-500 rounded-lg italic">
                    <p className="text-slate-600 dark:text-slate-300">
                      L&apos;utilisation du Service implique l&apos;acceptation pleine et entière des présentes Conditions Générales 
                      d&apos;Utilisation (CGU). Si vous n&apos;acceptez pas ces conditions, vous ne devez pas utiliser le Service.
                    </p>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications entreront en vigueur 
                    dès leur publication sur le site. Votre utilisation continue du Service après toute modification constitue 
                    votre acceptation des nouvelles CGU.
                  </p>
                </div>
              </section>

              {/* Section 3: Création de compte */}
              <section className="mb-12 scroll-mt-24" id="compte">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    3
                  </span>
                  Création de compte
                </h2>
                <div className="space-y-6">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Pour accéder à certaines fonctionnalités du Service, vous devez créer un compte utilisateur. Vous vous engagez à :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <svg className="w-5 h-5 text-sky-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        Fournir des informations exactes, complètes et à jour
                      </span>
                    </div>
                    <div className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <svg className="w-5 h-5 text-sky-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        Maintenir la sécurité de votre compte et mot de passe
                      </span>
                    </div>
                    <div className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <svg className="w-5 h-5 text-sky-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        Nous informer de toute utilisation non autorisée
                      </span>
                    </div>
                    <div className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <svg className="w-5 h-5 text-sky-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        Ne pas partager votre compte avec des tiers
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Description du service */}
              <section className="mb-12 scroll-mt-24" id="description">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    4
                  </span>
                  Description du service
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="text-lg font-semibold mb-4 text-sky-500">Fonctionnalités principales</h3>
                    <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>Conversion PDF vers Factur-X</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>Extraction automatique via OCR</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>Validation conformité EN 16931</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>Téléchargement des fichiers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>Historique des conversions</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 border border-sky-500/20 rounded-xl bg-sky-500/5 dark:bg-sky-500/10">
                    <h3 className="text-lg font-semibold mb-4 text-sky-500">Système de crédits</h3>
                    <ul className="text-sm space-y-3 text-slate-600 dark:text-slate-300">
                      <li className="flex justify-between items-center">
                        <span>Compte gratuit</span>
                        <span className="font-bold text-slate-900 dark:text-white">3 crédits/mois</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Packs</span>
                        <span className="font-bold text-slate-900 dark:text-white">20, 100, 500</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Starter</span>
                        <span className="font-bold text-slate-900 dark:text-white">60 crédits/mois</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Pro / Business</span>
                        <span className="font-bold text-slate-900 dark:text-white">200+ crédits/mois</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  Chaque conversion de facture consomme 1 crédit. Les crédits d&apos;abonnements non utilisés ne sont pas reportés. 
                  Les packs n&apos;expirent pas.
                </p>
              </section>

              {/* Section 5: Tarifs et paiement */}
              <section className="mb-12 scroll-mt-24" id="tarifs">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    5
                  </span>
                  Tarifs et paiement
                </h2>
                <div className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Les tarifs en vigueur sont affichés sur notre site web. Tous les prix sont indiqués hors taxes (HT) 
                    et la TVA applicable sera ajoutée lors du paiement.
                  </p>
                  <div className="flex items-center gap-3 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm font-medium">
                      Paiements sécurisés via Stripe. Nous n&apos;avons pas accès à vos informations bancaires.
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Les abonnements sont renouvelés automatiquement. Vous pouvez annuler votre abonnement à tout moment 
                    depuis votre espace client. L&apos;annulation prendra effet à la fin de la période de facturation en cours.
                  </p>
                </div>
              </section>

              {/* Section 6: Utilisation du service */}
              <section className="mb-12 scroll-mt-24" id="utilisation">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    6
                  </span>
                  Utilisation du service
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">Utilisation autorisée</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      Vous vous engagez à utiliser le Service uniquement pour des finalités légales et conformément à ces CGU. 
                      Vous ne devez pas :
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Traiter des factures frauduleuses</span>
                      </div>
                      <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Contourner les limitations</span>
                      </div>
                      <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Utiliser des scripts automatisés</span>
                      </div>
                      <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Revendre l&apos;accès au Service</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">Données traitées</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Vous conservez tous les droits de propriété sur les documents que vous téléchargez. Vous garantissez 
                      que vous avez le droit de traiter ces documents via notre Service. Nous nous engageons à ne pas utiliser 
                      vos documents à des fins autres que la fourniture du Service.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 7: Garanties et limitations */}
              <section className="mb-12 scroll-mt-24" id="garanties">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    7
                  </span>
                  Garanties et limitations
                </h2>
                <div className="space-y-6">
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">Garanties du Service</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      Nous nous efforçons de maintenir le Service disponible 99,9% du temps. Toutefois, nous ne garantissons pas :
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>L&apos;absence d&apos;interruptions ou d&apos;erreurs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>La précision à 100% de l&apos;extraction OCR</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>La compatibilité avec tous les formats PDF</span>
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl">
                      <h4 className="font-bold text-orange-900 dark:text-orange-400 mb-2">Votre responsabilité</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Vous êtes responsable de vérifier la conformité et l&apos;exactitude des factures générées avant de les utiliser.
                      </p>
                    </div>
                    <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                      <h4 className="font-bold text-blue-900 dark:text-blue-400 mb-2">Notre responsabilité</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Notre responsabilité est limitée au montant payé par vous au cours des 12 derniers mois.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 8: Conservation et archivage */}
              <section className="mb-12 scroll-mt-24" id="archivage">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    8
                  </span>
                  Conservation et archivage
                </h2>
                <div className="space-y-4">
                  <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-lg">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-amber-900 dark:text-amber-400">Attention :</strong> Les fichiers convertis sont conservés pendant{" "}
                      <strong>180 jours</strong> sur nos serveurs. Après ce délai, ils sont automatiquement supprimés. 
                      Il est de votre responsabilité de télécharger et conserver vos fichiers dans ce délai.
                    </p>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Conformément à la réglementation fiscale française, vous devez conserver vos factures électroniques 
                    pendant 10 ans. Nous proposons une option d&apos;archivage longue durée disponible sur demande.
                  </p>
                </div>
              </section>

              {/* Section 9: Propriété intellectuelle */}
              <section className="mb-12 scroll-mt-24" id="propriete">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    9
                  </span>
                  Propriété intellectuelle
                </h2>
                <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    Le Service, y compris tous les logiciels, textes, images, graphiques, logos et autres contenus, 
                    est protégé par les lois sur la propriété intellectuelle et appartient à Rayan Sekkat 
                    ou à ses concédants de licence.
                  </p>
                  <p>
                    Aucune licence ou droit ne vous est accordé, sauf les droits expressément prévus dans ces CGU.
                  </p>
                </div>
              </section>

              {/* Section 10: Protection des données */}
              <section className="mb-12 scroll-mt-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    10
                  </span>
                  Protection des données
                </h2>
                <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    Le traitement de vos données personnelles est décrit en détail dans notre{" "}
                    <Link href="/legal/privacy" className="text-sky-500 font-bold hover:underline decoration-2 underline-offset-4">
                      Politique de Confidentialité
                    </Link>.
                  </p>
                  <p>
                    Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité 
                    de vos données. Pour exercer ces droits, contactez-nous à : <span className="font-medium text-slate-900 dark:text-white">contact@pont-facturx.com</span>
                  </p>
                </div>
              </section>

              {/* Section 11: Résiliation */}
              <section className="mb-12 scroll-mt-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    11
                  </span>
                  Résiliation
                </h2>
                <div className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Vous pouvez résilier votre compte à tout moment en nous contactant ou via votre espace client.
                  </p>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mb-3">
                      Nous nous réservons le droit de suspendre ou résilier votre compte en cas de :
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>Violation de ces CGU</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>Utilisation frauduleuse du Service</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>Non-paiement des sommes dues</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
                        <span>Comportement abusif envers notre équipe</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 12: Droit applicable */}
              <section className="mb-12 scroll-mt-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    12
                  </span>
                  Droit applicable et juridiction
                </h2>
                <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    Les présentes CGU sont régies par le droit français.
                  </p>
                  <p>
                    En cas de litige, les parties s&apos;efforceront de trouver une solution amiable. À défaut, le litige sera 
                    porté devant les tribunaux compétents de France.
                  </p>
                </div>
              </section>

              {/* Section 13: Contact */}
              <section className="scroll-mt-24" id="contact">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    13
                  </span>
                  Contact
                </h2>
                
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Pour toute question concernant ces CGU, vous pouvez nous contacter :
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                    <svg className="w-8 h-8 text-sky-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email</h4>
                    <p className="text-sm font-medium text-slate-900 dark:text-white break-all">contact@pont-facturx.com</p>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                    <svg className="w-8 h-8 text-sky-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Adresse</h4>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">8 allée du pré</p>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                    <svg className="w-8 h-8 text-sky-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Téléphone</h4>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">06 36 36 56 96</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-sm text-slate-500 dark:text-slate-500">
                © 2026 Factur-X Convert. Tous droits réservés.
              </p>
              <div className="flex gap-8">
                <Link href="/legal/terms" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-sky-500 transition-colors">
                  CGU
                </Link>
                <Link href="/legal/privacy" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-sky-500 transition-colors">
                  Confidentialité
                </Link>
                <Link href="/legal/mentions" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-sky-500 transition-colors">
                  Mentions légales
                </Link>
              </div>
            </div>
          </div>
        </footer>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  Factur-X <span className="text-sky-500">Convert</span>
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Leader européen de la conversion de documents fiscaux structurés. Simplifiez votre conformité avec notre moteur intelligent.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4">PRODUIT</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/#features" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                      Fonctionnalités
                    </Link>
                  </li>
                  <li>
                    <Link href="/api" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                      API
                    </Link>
                  </li>
                  <li>
                    <Link href="/#pricing" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                      Tarifs
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4">LÉGAL</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/legal/privacy" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                      Confidentialité
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/terms" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                      CGU
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/mentions" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                      Mentions légales
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/security" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                      Sécurité
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4">SUPPORT</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/support" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                      Centre d'aide
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/status" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                      Statut
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                © 2026 Factur-X Convert. Tous droits réservés.
              </p>
            </div>
          </div>
        </footer>

        {/* Dark Mode Toggle */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform"
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

