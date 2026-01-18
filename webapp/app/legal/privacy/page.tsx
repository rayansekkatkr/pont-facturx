"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { useState } from "react";

export default function PrivacyPage() {
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
                  <a href="#introduction" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    1. Introduction
                  </a>
                  <a href="#donnees" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    2. Données collectées
                  </a>
                  <a href="#finalites" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    3. Finalités
                  </a>
                  <a href="#conservation" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    4. Conservation
                  </a>
                  <a href="#partage" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    5. Partage
                  </a>
                  <a href="#securite" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    6. Sécurité
                  </a>
                  <a href="#droits" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    7. Vos droits
                  </a>
                  <a href="#cookies" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    8. Cookies
                  </a>
                  <a href="#contact" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    9. Contact
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h1 className="font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
                  Politique de Confidentialité
                </h1>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dernière mise à jour : 18 janvier 2026
                </div>
              </div>

              {/* Section 1: Introduction */}
              <section className="mb-12 scroll-mt-24" id="introduction">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    1
                  </span>
                  Introduction
                </h2>
                <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    Rayan Sekkat, exploitant de Factur-X Convert (ci-après "nous", "notre"), s'engage à protéger 
                    la vie privée et les données personnelles de ses utilisateurs (ci-après "vous", "vos").
                  </p>
                  <p>
                    La présente Politique de Confidentialité décrit comment nous collectons, utilisons, partageons et 
                    protégeons vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) 
                    et aux lois françaises applicables.
                  </p>
                </div>
                
                <div className="mt-8 p-6 bg-sky-50 dark:bg-sky-500/5 border border-sky-100 dark:border-sky-500/10 rounded-2xl">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-sky-400 uppercase tracking-wider mb-4">
                    Responsable du traitement :
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Rayan Sekkat
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        SIRET : 98009976600019
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        8 allée du pré
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        contact@pont-facturx.com
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Données collectées */}
              <section className="mb-12 scroll-mt-24" id="donnees">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    2
                  </span>
                  Données personnelles collectées
                </h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-4">
                      2.1 Données d'identification
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-600 dark:text-slate-300">
                          <strong>Inscription :</strong> Prénom, nom, email, mot de passe (hashé)
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-600 dark:text-slate-300">
                          <strong>Entreprise :</strong> Nom de l'entreprise, SIRET (optionnel)
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-600 dark:text-slate-300">
                          <strong>Google OAuth :</strong> Si vous vous connectez via Google : email, nom, photo de profil
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-4">
                      2.2 Données de facturation
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-sky-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span className="text-slate-600 dark:text-slate-300">
                          Informations de paiement traitées par Stripe, non stockées sur nos serveurs.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-sky-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-slate-600 dark:text-slate-300">
                          Historique des transactions et abonnements.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3: Finalités */}
              <section className="mb-12 scroll-mt-24" id="finalites">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    3
                  </span>
                  Finalités du traitement
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-sky-500 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl">
                    <p className="font-semibold text-slate-900 dark:text-white">Fourniture du service</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Conversion de vos factures, gestion de votre compte, support client.
                    </p>
                    <p className="text-xs text-sky-500 font-medium mt-2 uppercase tracking-tight">
                      Base légale : Exécution du contrat
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-sky-500 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl">
                    <p className="font-semibold text-slate-900 dark:text-white">Facturation et paiements</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Traitement des paiements, gestion des abonnements, émission de factures.
                    </p>
                    <p className="text-xs text-sky-500 font-medium mt-2 uppercase tracking-tight">
                      Base légale : Exécution du contrat + Obligations légales
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-sky-500 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl">
                    <p className="font-semibold text-slate-900 dark:text-white">Sécurité et conformité</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Prévention de la fraude, respect des obligations légales, archivage légal.
                    </p>
                    <p className="text-xs text-sky-500 font-medium mt-2 uppercase tracking-tight">
                      Base légale : Obligations légales + Intérêt légitime
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 4: Conservation */}
              <section className="mb-12 scroll-mt-24" id="conservation">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    4
                  </span>
                  Durée de conservation
                </h2>
                
                <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">Type de données</th>
                        <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">Durée</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Compte utilisateur actif</td>
                        <td className="px-6 py-4">Durée du contrat + 3 ans</td>
                      </tr>
                      <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Fichiers convertis (standard)</td>
                        <td className="px-6 py-4">180 jours</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">Données de facturation</td>
                        <td className="px-6 py-4">10 ans (obligation légale)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 5: Partage des données */}
              <section className="mb-12 scroll-mt-24" id="partage">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    5
                  </span>
                  Partage des données
                </h2>
                
                <div className="space-y-6 text-slate-600 dark:text-slate-300">
                  <p>
                    Nous ne vendons ni ne louons vos données personnelles. Nous pouvons partager vos données avec :
                  </p>

                  <div className="space-y-4">
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-3">Prestataires de services</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 mt-1">•</span>
                          <span><strong>Stripe :</strong> Traitement des paiements (Irlande)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 mt-1">•</span>
                          <span><strong>Scaleway :</strong> Hébergement des données (France)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 mt-1">•</span>
                          <span><strong>Services d&apos;email :</strong> Notifications transactionnelles</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-3">Obligations légales</h3>
                      <p className="text-sm">
                        Nous pouvons divulguer vos données si requis par la loi, une ordonnance judiciaire ou une autorité administrative compétente.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6: Sécurité des données */}
              <section className="mb-12 scroll-mt-24" id="securite">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    6
                  </span>
                  Sécurité des données
                </h2>
                
                <div className="space-y-6">
                  <p className="text-slate-600 dark:text-slate-300">
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <svg className="w-5 h-5 text-sky-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Chiffrement</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">HTTPS/TLS en transit, AES-256 au repos</p>
                      </div>
                    </div>

                    <div className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <svg className="w-5 h-5 text-sky-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Authentification</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Hashage bcrypt, tokens JWT sécurisés</p>
                      </div>
                    </div>

                    <div className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <svg className="w-5 h-5 text-sky-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Surveillance</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Détection d&apos;incidents 24/7</p>
                      </div>
                    </div>

                    <div className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <svg className="w-5 h-5 text-sky-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Sauvegardes</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Backups réguliers et plan de reprise</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10 rounded-xl">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <strong>En cas de violation :</strong> Notification sous 72 heures conformément au RGPD.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 7: Vos droits */}
              <section className="mb-12 scroll-mt-24" id="droits">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    7
                  </span>
                  Vos droits (RGPD)
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="font-bold text-slate-900 dark:text-white">Droit d&apos;accès</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Obtenir une copie de vos données personnelles.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="font-bold text-slate-900 dark:text-white">Droit de rectification</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Corriger vos données inexactes ou incomplètes.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="font-bold text-slate-900 dark:text-white">Droit à l&apos;effacement</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Demander la suppression de vos données.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      <span className="font-bold text-slate-900 dark:text-white">Droit à la portabilité</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Récupérer vos données sous format structuré (JSON/CSV).
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-sky-50 dark:bg-sky-500/5 border border-sky-100 dark:border-sky-500/10 rounded-2xl">
                  <p className="font-bold text-slate-900 dark:text-white mb-2">Pour exercer vos droits :</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Envoyez un email à{" "}
                    <a href="mailto:contact@pont-facturx.com" className="text-sky-500 font-bold hover:underline">
                      contact@pont-facturx.com
                    </a>{" "}
                    avec l&apos;objet &quot;RGPD - [Votre demande]&quot;.<br />
                    Nous répondrons sous 1 mois maximum.
                  </p>
                </div>
              </section>

              {/* Section 8: Cookies */}
              <section className="mb-12 scroll-mt-24" id="cookies">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    8
                  </span>
                  Cookies
                </h2>
                
                <div className="space-y-6">
                  <p className="text-slate-600 dark:text-slate-300">
                    Nous utilisons des cookies pour améliorer votre expérience :
                  </p>

                  <div className="space-y-4">
                    <div className="p-5 bg-green-50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-bold text-slate-900 dark:text-white">Cookies essentiels (obligatoires)</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <li><code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">pfxt_token</code> : Authentification (7 jours)</li>
                        <li><code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">session</code> : Gestion de session</li>
                      </ul>
                    </div>

                    <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="font-bold text-slate-900 dark:text-white">Cookies analytiques (avec consentement)</h3>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Vercel Analytics : Statistiques d&apos;utilisation anonymisées
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 9: Contact */}
              <section className="mb-12 scroll-mt-24" id="contact">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    9
                  </span>
                  Contact
                </h2>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-2xl font-bold">
                      RS
                    </div>
                  </div>
                  <div className="space-y-4 text-center sm:text-left">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        Délégué à la Protection des Données (DPO)
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Rayan Sekkat</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                        <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <span className="text-slate-600 dark:text-slate-300">contact@pont-facturx.com</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                        <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-slate-600 dark:text-slate-300">06 36 36 56 96</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 10: Modifications */}
              <section className="mb-12 scroll-mt-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    10
                  </span>
                  Modifications de la politique
                </h2>
                
                <div className="space-y-4 text-slate-600 dark:text-slate-300">
                  <p>
                    Nous pouvons modifier cette Politique de Confidentialité. Les modifications entreront en vigueur dès leur publication sur cette page. La date de &quot;Dernière mise à jour&quot; sera actualisée.
                  </p>
                  <div className="p-4 bg-sky-50 dark:bg-sky-500/5 border border-sky-100 dark:border-sky-500/10 rounded-xl">
                    <p className="text-sm">
                      <strong>En cas de modification substantielle</strong>, nous vous en informerons par email ou via une notification sur le Service.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

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
