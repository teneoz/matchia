import { Suspense } from 'react'
import { ProjectDetails } from '@/components/projects/ProjectDetails'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: 'Détails du Projet | FootPredict AI',
    description: 'Voir les détails et les prédictions du projet',
  }
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="text-center py-12 text-slate-400">
            Chargement du projet...
          </div>
        }
      >
        <ProjectDetails projectId={params.id} />
      </Suspense>
    </div>
  )
}

