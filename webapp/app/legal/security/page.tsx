"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { useState } from "react";

export default function SecurityPage() {
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
                  <a href="#engagement" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    1. Engagement
                  </a>
                  <a href="#protection" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    2. Protection
                  </a>
                  <a href="#infrastructure" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    3. Infrastructure
                  </a>
                  <a href="#authentification" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    4. Authentification
                  </a>
                  <a href="#fichiers" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    5. Traitement fichiers
                  </a>
                  <a href="#incidents" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    6. Incidents
                  </a>
                  <a href="#conformite" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    7. Conformité
                  </a>
                  <a href="#vulnerabilite" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500 transition-all">
                    9. Signaler
                  </a>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden p-8 sm:p-12">
              
              {/* Header */}
              <div className="mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-6">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
                  Politique de Sécurité
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Dernière mise à jour : 18 janvier 2026
                </p>
              </div>

              {/* Section 1: Engagement sécurité */}
              <section className="mb-12 scroll-mt-24" id="engagement">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    1
                  </span>
                  Notre engagement sécurité
                </h2>
                <div className="space-y-6">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Chez Factur-X Convert, la sécurité de vos données est notre priorité absolue. Nous mettons en œuvre des mesures techniques et organisationnelles robustes pour protéger vos informations contre tout accès non autorisé, modification, divulgation ou destruction.
                  </p>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 border border-purple-200 dark:border-purple-800 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <h3 className="font-bold text-purple-900 dark:text-purple-200">Certification et conformité</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-purple-900 dark:text-purple-200">Conformité RGPD</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-purple-900 dark:text-purple-200">ISO/IEC 27001 appliqué</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-purple-900 dark:text-purple-200">Hébergement UE</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-purple-900 dark:text-purple-200">Audits réguliers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Protection des données */}
              <section className="mb-12 scroll-mt-24" id="protection">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    2
                  </span>
                  Protection des données
                </h2>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">2.1 Chiffrement</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm mb-4">
                      1
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">TLS 1.3</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Chiffrement en transit via HTTPS/TLS 1.3 avec certificats SSL
                    </p>
                  </div>
                  
                  <div className="p-5 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border border-violet-200 dark:border-violet-800 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-violet-500 text-white flex items-center justify-center font-bold text-sm mb-4">
                      2
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">AES-256</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Chiffrement au repos pour tous vos fichiers PDF et bases de données
                    </p>
                  </div>
                  
                  <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm mb-4">
                      3
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">bcrypt</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Mots de passe hashés avec facteur de coût élevé
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">2.2 Accès aux données</h3>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300"><strong>Moindre privilège :</strong> Permissions limitées au strict nécessaire</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300"><strong>MFA obligatoire :</strong> Pour tous les accès administratifs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300"><strong>Logs d'audit :</strong> Traçabilité complète des accès</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300"><strong>Révocation auto :</strong> Désactivation immédiate</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 3: Infrastructure sécurisée */}
              <section className="mb-12 scroll-mt-24" id="infrastructure">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    3
                  </span>
                  Infrastructure sécurisée
                </h2>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">3.1 Architecture</h3>
                <div className="space-y-3 mb-8">
                  <div className="p-4 border-l-4 border-purple-500 bg-slate-50 dark:bg-slate-800/40 rounded-r-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Pare-feu applicatif (WAF)</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Protection contre injection SQL, XSS, CSRF</p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-slate-50 dark:bg-slate-800/40 rounded-r-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Isolation réseau</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Segmentation via VPC et sous-réseaux privés</p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-slate-50 dark:bg-slate-800/40 rounded-r-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Détection d'intrusion (IDS/IPS)</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Monitoring en temps réel 24/7</p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-slate-50 dark:bg-slate-800/40 rounded-r-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Mises à jour automatiques</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">Patches de sécurité appliqués automatiquement</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">3.2 Sauvegardes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-800/20 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Quotidiennes</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tous les fichiers et BDD</p>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-800/20 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Rétention 30 jours</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Historique complet</p>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-800/20 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Géo-réplication</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Multi-datacenters EU</p>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-800/20 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Tests mensuels</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Restauration validée</p>
                  </div>
                </div>
              </section>

              {/* Section 4: Authentification */}
              <section className="mb-12 scroll-mt-24" id="authentification">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    4
                  </span>
                  Authentification et contrôle d'accès
                </h2>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">4.1 Authentification forte</h3>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl mb-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm">
                        <strong>Mots de passe sécurisés :</strong> 8+ caractères, complexité imposée
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm">
                        <strong>OAuth 2.0 :</strong> Connexion Google (recommandé)
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm">
                        <strong>Tokens JWT :</strong> Sessions sécurisées (7 jours)
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm">
                        <strong>Déconnexion auto :</strong> Après 30 min d'inactivité
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">4.2 Protection contre attaques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
                    <h4 className="font-bold text-red-900 dark:text-red-200 mb-2">Rate limiting</h4>
                    <p className="text-sm text-red-800 dark:text-red-300">Anti force brute</p>
                  </div>
                  <div className="p-5 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-xl">
                    <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-2">CAPTCHA</h4>
                    <p className="text-sm text-orange-800 dark:text-orange-300">Anti-bots</p>
                  </div>
                  <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-2">Détection anomalies</h4>
                    <p className="text-sm text-amber-800 dark:text-amber-300">Alertes automatiques</p>
                  </div>
                  <div className="p-5 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
                    <h4 className="font-bold text-red-900 dark:text-red-200 mb-2">Blocage IP</h4>
                    <p className="text-sm text-red-800 dark:text-red-300">Ban auto malveillants</p>
                  </div>
                </div>
              </section>

              {/* Section 5: Traitement des fichiers */}
              <section className="mb-12 scroll-mt-24" id="fichiers">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    5
                  </span>
                  Traitement des fichiers
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">5.1 Isolation</h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      Chaque fichier téléchargé est traité dans un environnement isolé (sandbox) pour prévenir toute exécution de code malveillant.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">5.2 Analyse sécurité</h3>
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-200">
                          <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Vérification type MIME (PDF uniquement)
                        </li>
                        <li className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-200">
                          <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Validation structure PDF
                        </li>
                        <li className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-200">
                          <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Limitation 10 Mo max
                        </li>
                        <li className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-200">
                          <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Scan antivirus systématique
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">5.3 Conservation</h3>
                    <div className="p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        <strong>Suppression automatique après 180 jours.</strong> Vous pouvez supprimer vos fichiers manuellement à tout moment.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6: Gestion des incidents */}
              <section className="mb-12 scroll-mt-24" id="incidents">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    6
                  </span>
                  Gestion des incidents
                </h2>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">6.1 Plan de réponse</h3>
                <div className="space-y-3 mb-8">
                  {[
                    { num: 1, title: "Détection", desc: "Monitoring 24/7 et alertes auto" },
                    { num: 2, title: "Isolation", desc: "Confinement immédiat" },
                    { num: 3, title: "Investigation", desc: "Analyse forensique" },
                    { num: 4, title: "Remédiation", desc: "Correction et restauration" },
                    { num: 5, title: "Notification", desc: "Information sous 72h (RGPD)" },
                    { num: 6, title: "Post-mortem", desc: "Amélioration continue" }
                  ].map((step) => (
                    <div key={step.num} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {step.num}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{step.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">6.2 Notification</h3>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 border border-purple-200 dark:border-purple-800 rounded-xl">
                  <p className="text-sm text-purple-900 dark:text-purple-200 mb-4">
                    En cas de violation RGPD, notification sous <strong>72 heures</strong> par :
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-purple-900 dark:text-purple-200">
                      <span>✉️</span>
                      <span>Email</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-purple-900 dark:text-purple-200">
                      <span>🔔</span>
                      <span>Notification dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-purple-900 dark:text-purple-200">
                      <span>📢</span>
                      <span>Bannière site (si impact généralisé)</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 7: Conformité et audits */}
              <section className="mb-12 scroll-mt-24" id="conformite">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    7
                  </span>
                  Conformité et audits
                </h2>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">7.1 Audits réguliers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Audits internes</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Trimestriels</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Tests pénétration</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Annuels (experts externes)</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Revue de code</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Automatique + manuelle</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Scan vulnérabilités</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Hebdomadaire</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">7.2 Normes appliquées</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800 rounded-xl">
                    <h4 className="font-bold text-green-900 dark:text-green-200 mb-1">RGPD</h4>
                    <p className="text-sm text-green-800 dark:text-green-300">Conformité totale</p>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1">ISO 27001</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300">Bonnes pratiques</p>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border border-violet-200 dark:border-violet-800 rounded-xl">
                    <h4 className="font-bold text-violet-900 dark:text-violet-200 mb-1">OWASP Top 10</h4>
                    <p className="text-sm text-violet-800 dark:text-violet-300">Protection complète</p>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border border-orange-200 dark:border-orange-800 rounded-xl">
                    <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-1">PCI DSS</h4>
                    <p className="text-sm text-orange-800 dark:text-orange-300">Via Stripe</p>
                  </div>
                </div>
              </section>

              {/* Section 8: Responsabilités */}
              <section className="mb-12 scroll-mt-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    8
                  </span>
                  Vos responsabilités
                </h2>
                <div className="p-6 bg-sky-50 dark:bg-sky-900/10 border border-sky-200 dark:border-sky-800 rounded-xl">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    La sécurité est une responsabilité partagée :
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Choisir un mot de passe fort et unique",
                      "Ne jamais partager vos identifiants",
                      "Utiliser OAuth Google (recommandé)",
                      "Vous déconnecter sur appareil partagé",
                      "Maintenir vos appareils à jour",
                      "Vérifier régulièrement l'activité",
                      "Signaler toute activité suspecte"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <svg className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 9: Signaler une vulnérabilité */}
              <section className="mb-12 scroll-mt-24" id="vulnerabilite">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    9
                  </span>
                  Signaler une vulnérabilité
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                  Nous encourageons la divulgation responsable. Si vous découvrez une faille, signalez-la immédiatement.
                </p>
                <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-bold text-red-900 dark:text-red-200">Programme de divulgation responsable</h3>
                  </div>
                  <p className="text-sm text-red-900 dark:text-red-200 mb-3">
                    Contactez : <strong className="text-red-600 dark:text-red-400">security@pont-facturx.com</strong>
                  </p>
                  <p className="text-xs text-red-800 dark:text-red-300">
                    Réponse sous 48h • Correction vulnérabilités critiques sous 7 jours • Pas de poursuites pour chercheurs de bonne foi
                  </p>
                </div>
              </section>

              {/* Section 10: Transparence */}
              <section className="mb-12 scroll-mt-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    10
                  </span>
                  Transparence
                </h2>
                <p className="text-slate-700 dark:text-slate-300 mb-4">Rapport annuel détaillant :</p>
                <ul className="space-y-2">
                  {[
                    "Nombre d'incidents de sécurité",
                    "Demandes d'accès par autorités",
                    "Temps d'indisponibilité",
                    "Améliorations apportées"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <svg className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Section 11: Contact */}
              <section className="mb-12 scroll-mt-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white text-sm">
                    11
                  </span>
                  Contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border border-red-200 dark:border-red-800 rounded-xl">
                    <h4 className="font-bold text-red-900 dark:text-red-200 mb-2">Sécurité</h4>
                    <a href="mailto:security@pont-facturx.com" className="text-sm text-red-600 dark:text-red-400 hover:underline break-all">
                      security@pont-facturx.com
                    </a>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 border border-sky-200 dark:border-sky-800 rounded-xl">
                    <h4 className="font-bold text-sky-900 dark:text-sky-200 mb-2">Support</h4>
                    <a href="mailto:contact@pont-facturx.com" className="text-sm text-sky-600 dark:text-sky-400 hover:underline break-all">
                      contact@pont-facturx.com
                    </a>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 border border-purple-200 dark:border-purple-800 rounded-xl">
                    <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-2">DPO (RGPD)</h4>
                    <a href="mailto:dpo@pont-facturx.com" className="text-sm text-purple-600 dark:text-purple-400 hover:underline break-all">
                      dpo@pont-facturx.com
                    </a>
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
