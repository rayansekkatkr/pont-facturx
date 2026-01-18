"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { useState } from "react";

export default function MentionsPage() {
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
                  <a href="#editeur" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    1. Éditeur
                  </a>
                  <a href="#hebergement" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    2. Hébergement
                  </a>
                  <a href="#propriete" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    3. Propriété intellectuelle
                  </a>
                  <a href="#donnees" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    4. Protection des données
                  </a>
                  <a href="#cookies" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    5. Cookies
                  </a>
                  <a href="#credits" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    6. Crédits
                  </a>
                  <a href="#responsabilite" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    7. Responsabilité
                  </a>
                  <a href="#conformite" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    11. Conformité
                  </a>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden p-8 sm:p-12">
              
              {/* Header */}
              <div className="mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-6">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h1 className="font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
                  Mentions Légales
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Informations légales et éditoriales
                </p>
              </div>

              {/* Section 1: Éditeur */}
              <section className="mb-12 scroll-mt-24" id="editeur">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    1
                  </span>
                  Éditeur du site
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Raison sociale</h4>
                    <p className="text-slate-900 dark:text-white font-medium">Rayan Sekkat</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Forme juridique</h4>
                    <p className="text-slate-900 dark:text-white font-medium">Micro-entrepreneur</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">SIRET</h4>
                    <p className="text-slate-900 dark:text-white font-medium">980 099 766 00019</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">TVA</h4>
                    <p className="text-slate-900 dark:text-white font-medium">Non assujetti</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Siège social</h4>
                    <p className="text-slate-900 dark:text-white font-medium">8 allée du pré</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Téléphone</h4>
                    <p className="text-slate-900 dark:text-white font-medium">06 36 36 56 96</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Email</h4>
                    <p className="text-slate-900 dark:text-white font-medium break-all">contact@pont-facturx.com</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Directeur de publication</h4>
                    <p className="text-slate-900 dark:text-white font-medium">Rayan Sekkat</p>
                  </div>
                </div>
              </section>

              {/* Section 2: Hébergement */}
              <section className="mb-12 scroll-mt-24" id="hebergement">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    2
                  </span>
                  Hébergement
                </h2>
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-800/20 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Application web (Frontend)</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Vercel Inc.</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      340 S Lemon Ave #4133<br />
                      Walnut, CA 91789, USA<br />
                      <a href="https://vercel.com" className="text-sky-500 hover:underline font-medium">https://vercel.com</a>
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 rounded-xl border border-sky-200 dark:border-sky-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">API et base de données (Backend)</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Scaleway</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      8 rue de la Ville l&apos;Évêque, 75008 Paris, France<br />
                      <span className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-white/50 dark:bg-slate-900/50 rounded-lg">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Serveurs : Paris (FR) / Amsterdam (NL)
                      </span>
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Propriété intellectuelle */}
              <section className="mb-12 scroll-mt-24" id="propriete">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    3
                  </span>
                  Propriété intellectuelle
                </h2>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Les marques "Factur-X Convert" et tous les logos présents sur le site sont des marques déposées ou enregistrées. Toute reproduction totale ou partielle de ces marques ou de ces logos, effectuée à partir des éléments du site sans l'autorisation expresse de l'éditeur est donc prohibée.
                  </p>
                </div>
              </section>

              {/* Section 4: Protection des données */}
              <section className="mb-12 scroll-mt-24" id="donnees">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    4
                  </span>
                  Protection des données personnelles
                </h2>
                <div className="space-y-4">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Conformément à la loi « informatique et libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Pour exercer ces droits, vous pouvez nous contacter par email à l'adresse :{" "}
                    <a href="mailto:contact@pont-facturx.com" className="text-sky-500 hover:underline font-medium">
                      contact@pont-facturx.com
                    </a>
                  </p>
                  <div className="p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">Déclaration CNIL</h3>
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          Une déclaration à la CNIL sera effectuée lors du lancement officiel du service, conformément aux dispositions légales en vigueur.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Pour plus d'informations sur la protection de vos données personnelles, consultez notre{" "}
                    <Link href="/legal/privacy" className="text-sky-500 hover:underline font-medium">
                      politique de confidentialité
                    </Link>.
                  </p>
                </div>
              </section>

              {/* Section 5: Cookies */}
              <section className="mb-12 scroll-mt-24" id="cookies">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    5
                  </span>
                  Cookies
                </h2>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    Ce site utilise des cookies pour améliorer l'expérience utilisateur et assurer le bon fonctionnement de certaines fonctionnalités. Les cookies utilisés sont :
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300">
                        <strong>Cookies de session</strong> : nécessaires au fonctionnement de l'authentification
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300">
                        <strong>Cookies de préférence</strong> : pour enregistrer vos préférences (langue, thème)
                      </span>
                    </li>
                  </ul>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                    Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait limiter certaines fonctionnalités du site.
                  </p>
                </div>
              </section>

              {/* Section 6: Crédits */}
              <section className="mb-12 scroll-mt-24" id="credits">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    6
                  </span>
                  Crédits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 border border-sky-200 dark:border-sky-800 rounded-xl">
                    <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Conception</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Rayan Sekkat</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border border-violet-200 dark:border-violet-800 rounded-xl">
                    <div className="w-10 h-10 bg-violet-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Technologies</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Next.js, React, TypeScript, Tailwind CSS, FastAPI, Python, PostgreSQL, Redis
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Icônes</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Lucide Icons</p>
                  </div>
                </div>
              </section>

              {/* Section 7: Limitation de responsabilité */}
              <section className="mb-12 scroll-mt-24" id="responsabilite">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    7
                  </span>
                  Limitation de responsabilité
                </h2>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-4">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300">
                        L'éditeur ne peut être tenu responsable des dommages directs ou indirects causés par l'utilisation du service
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300">
                        L'éditeur ne garantit pas l'absence d'interruption ou d'erreur dans l'accès au service
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300">
                        L'éditeur ne peut être tenu responsable des virus qui pourraient infecter l'ordinateur ou tout matériel informatique
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300">
                        La responsabilité de l'éditeur ne peut être engagée en cas de force majeure ou du fait imprévisible d'un tiers
                      </span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 8-10: Autres sections simplifiées */}
              <section className="mb-12 scroll-mt-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    8
                  </span>
                  Liens hypertextes
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Ce site peut contenir des liens hypertextes vers d'autres sites. L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou à leur accessibilité.
                </p>
              </section>

              <section className="mb-12 scroll-mt-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    9
                  </span>
                  Droit applicable
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Le présent site et les présentes mentions légales sont régis par le droit français. En cas de litige, et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
                </p>
              </section>

              <section className="mb-12 scroll-mt-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    10
                  </span>
                  Contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-800/20 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Email</h3>
                    <a href="mailto:contact@pont-facturx.com" className="text-sm text-sky-500 hover:underline break-all">
                      contact@pont-facturx.com
                    </a>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-800/20 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Adresse</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      8 allée du pré
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-800/20 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="w-10 h-10 bg-violet-500 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Téléphone</h3>
                    <a href="tel:0636365696" className="text-sm text-slate-600 dark:text-slate-400 hover:text-sky-500">
                      06 36 36 56 96
                    </a>
                  </div>
                </div>
              </section>

              {/* Section 11: Conformité réglementaire */}
              <section className="mb-12 scroll-mt-24" id="conformite">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    11
                  </span>
                  Conformité réglementaire
                </h2>
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800 rounded-xl">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    Le service Factur-X Convert est conforme aux normes et réglementations suivantes :
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">EN 16931</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Norme européenne de facturation électronique</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Factur-X 1.0</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Format franco-allemand hybride PDF/XML</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">PDF/A-3</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Standard d'archivage électronique</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">RGPD</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Protection des données personnelles</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg md:col-span-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Directive 2014/55/UE</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Directive européenne relative à la facturation électronique dans les marchés publics</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                © 2024 Factur-X Convert. Tous droits réservés.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <Link href="/legal/terms" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                  Conditions d'utilisation
                </Link>
                <Link href="/legal/privacy" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                  Confidentialité
                </Link>
                <Link href="/legal/mentions" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                  Mentions légales
                </Link>
                <Link href="/legal/security" className="text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                  Sécurité
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
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed bottom-6 right-6 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
