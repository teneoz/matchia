'use client'

import { Activity } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * Header simplifié qui affiche toujours les boutons de connexion
 * Utilisé comme fallback si useAuth a des problèmes
 */
export function HeaderFallback() {
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





