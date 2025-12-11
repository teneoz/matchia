'use client'

import { useAuth } from '@/hooks/useAuth'
import { Activity, User, LogOut, Settings, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export function Header() {
  const { user, profile, loading, error } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

  // Afficher le fallback si le chargement prend trop de temps
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowFallback(true)
      }, 3000) // 3 secondes max

      return () => clearTimeout(timer)
    } else {
      setShowFallback(false)
    }
  }, [loading])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  // Si erreur ou chargement trop long, afficher les boutons par défaut
  if (error || showFallback) {
    return (
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FootPredict AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white transition px-4 py-2"
            >
              Connexion
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition">
                Commencer
              </Button>
            </Link>
          </div>
        </nav>
      </header>
    )
  }

  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">FootPredict AI</span>
        </Link>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-slate-300 hidden sm:inline">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-xl border border-white/10 shadow-xl z-50">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">
                        {profile?.full_name || 'Utilisateur'}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition text-slate-300 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Activity className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/ai/chat"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition text-slate-300 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Assistant IA
                      </Link>
                      <Link
                        href="/projects"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition text-slate-300 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Activity className="w-4 h-4" />
                        Mes Projets
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition text-slate-300 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profil
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition text-slate-300 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Paramètres
                      </Link>
                      <div className="border-t border-white/10 my-2" />
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 transition text-red-400 hover:text-red-300"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-300 hover:text-white transition px-4 py-2"
              >
                Connexion
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition">
                  Commencer
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

