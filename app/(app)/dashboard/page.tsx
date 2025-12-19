import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Dashboard | FootPredict AI',
  description: 'Tableau de bord de vos prédictions',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-slate-400 mb-8">
        Bienvenue, {user.email}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-2">Prédictions</h3>
          <p className="text-3xl font-bold text-emerald-400">0</p>
          <p className="text-sm text-slate-400 mt-2">Total</p>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-2">Projets</h3>
          <p className="text-3xl font-bold text-emerald-400">0</p>
          <p className="text-sm text-slate-400 mt-2">Créés</p>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-2">Crédits</h3>
          <p className="text-3xl font-bold text-emerald-400">10</p>
          <p className="text-sm text-slate-400 mt-2">Disponibles</p>
        </div>
      </div>
    </div>
  )
}





