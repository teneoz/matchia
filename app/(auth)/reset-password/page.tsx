import { Activity } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const metadata = {
  title: 'Réinitialisation du mot de passe | FootPredict AI',
  description: 'Réinitialisez votre mot de passe',
}

export default function ResetPasswordPage() {
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
          <h1 className="text-3xl font-bold text-white mb-2">
            Mot de passe oublié
          </h1>
          <p className="text-slate-400">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                required
                autoComplete="email"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600"
            >
              Envoyer le lien
            </Button>

            <div className="text-center text-sm text-slate-400">
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
                Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}





