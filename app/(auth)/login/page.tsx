import { LoginForm } from '@/components/auth/LoginForm'
import { Activity } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Connexion | FootPredict AI',
  description: 'Connectez-vous à votre compte FootPredict AI',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FootPredict AI</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
          <p className="text-slate-400">
            Accédez à vos prédictions et analyses
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

