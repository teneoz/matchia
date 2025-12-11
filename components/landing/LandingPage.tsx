import React from 'react';
import { Activity, TrendingUp, Target, Zap, Brain, BarChart3, Shield, Clock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FootPredict AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-300 hover:text-white transition px-4 py-2">
              Connexion
            </button>
            <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition">
              Commencer
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full mb-6 border border-emerald-500/20">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">IA de nouvelle génération</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Analyses de matchs<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            propulsées par l'IA
          </span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Accédez à des prédictions ultra-précises basées sur des millions de données. 
          L'intelligence artificielle qui analyse le football comme jamais auparavant.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-emerald-500/30 transition transform hover:scale-105">
            Essai gratuit 7 jours
          </button>
          <button className="w-full sm:w-auto bg-white/5 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/10 hover:bg-white/10 transition backdrop-blur">
            Voir une démo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: '85%', label: 'Précision' },
            { value: '1M+', label: 'Données analysées' },
            { value: '50K+', label: 'Utilisateurs' },
            { value: '24/7', label: 'Analyses live' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-emerald-400 mb-2">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pourquoi FootPredict AI ?
          </h2>
          <p className="text-xl text-slate-400">
            Une technologie d'IA de pointe pour des analyses incomparables
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: 'IA Avancée',
              description: 'Algorithmes d\'apprentissage profond entraînés sur des années de données historiques'
            },
            {
              icon: TrendingUp,
              title: 'Prédictions Précises',
              description: 'Taux de réussite de 85% sur les pronostics majeurs grâce à notre modèle propriétaire'
            },
            {
              icon: BarChart3,
              title: 'Analyses Détaillées',
              description: 'Statistiques complètes : forme, confrontations, blessures, conditions météo'
            },
            {
              icon: Clock,
              title: 'Temps Réel',
              description: 'Mises à jour instantanées et analyses live pendant les matchs'
            },
            {
              icon: Target,
              title: 'Multi-Compétitions',
              description: 'Couverture de 100+ ligues et compétitions à travers le monde'
            },
            {
              icon: Shield,
              title: 'Données Fiables',
              description: 'Sources vérifiées et croisées pour une fiabilité maximale'
            }
          ].map((feature) => (
            <div 
              key={feature.title}
              className="group bg-gradient-to-br from-white/5 to-white/0 backdrop-blur rounded-2xl p-8 border border-white/10 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <feature.icon className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-slate-400">
            Simple, rapide et puissant
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: '01',
              title: 'Sélectionnez un match',
              description: 'Parcourez les matchs à venir et choisissez celui qui vous intéresse'
            },
            {
              step: '02',
              title: 'L\'IA analyse',
              description: 'Notre système traite instantanément des milliers de données pertinentes'
            },
            {
              step: '03',
              title: 'Obtenez vos insights',
              description: 'Recevez des prédictions détaillées avec scores de confiance et statistiques'
            }
          ].map((item, index) => (
            <div key={item.step} className="relative">
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-2xl p-8 border border-emerald-500/20">
                <div className="text-6xl font-bold text-emerald-500/20 mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-600/10 to-emerald-500/10 rounded-3xl p-12 md:p-16 text-center border border-emerald-500/20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à révolutionner vos analyses ?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à notre IA pour leurs prédictions
          </p>
          <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-emerald-500/40 transition transform hover:scale-105">
            Commencer gratuitement
          </button>
          <p className="text-slate-400 text-sm mt-4">Aucune carte bancaire requise</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">FootPredict AI</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2024 FootPredict AI. Tous droits réservés.
            </div>
            <div className="flex gap-6 text-slate-400 text-sm">
              <a href="#" className="hover:text-white transition">Conditions</a>
              <a href="#" className="hover:text-white transition">Confidentialité</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

