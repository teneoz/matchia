import { Suspense } from 'react'
import { ProjectsList } from '@/components/projects/ProjectsList'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Mes Projets | FootPredict AI',
  description: 'Gérez vos projets de prédictions',
}

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Mes Projets</h1>
          <p className="text-slate-400">
            Organisez et partagez vos prédictions de matchs
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Projet
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-12 text-slate-400">
            Chargement des projets...
          </div>
        }
      >
        <ProjectsList />
      </Suspense>
    </div>
  )
}

