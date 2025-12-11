import { NewProjectForm } from '@/components/projects/NewProjectForm'

export const metadata = {
  title: 'Nouveau Projet | FootPredict AI',
  description: 'Créez un nouveau projet de prédictions',
}

export default function NewProjectPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Nouveau Projet</h1>
        <p className="text-slate-400">
          Créez un nouveau projet pour organiser vos prédictions
        </p>
      </div>

      <NewProjectForm />
    </div>
  )
}

