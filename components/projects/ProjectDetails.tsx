'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProjectShare } from './ProjectShare'
import type { UserProject } from '@/lib/types'
import { ArrowLeft, Edit, Share2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ProjectDetailsProps {
  projectId: string
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const router = useRouter()
  const [project, setProject] = useState<UserProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShare, setShowShare] = useState(false)

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Projet non trouvé')
          } else {
            throw new Error('Failed to fetch project')
          }
          return
        }

        const data = await response.json()
        setProject(data.project)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-400">
        Chargement du projet...
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="bg-red-500/10 text-red-400 p-4 rounded border border-red-500/20">
        {error || 'Projet non trouvé'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{project.name}</CardTitle>
              {project.description && (
                <p className="text-slate-400">{project.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowShare(!showShare)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div>
                Créé le{' '}
                {format(new Date(project.created_at), 'd MMMM yyyy', {
                  locale: fr,
                })}
              </div>
              <div>
                {project.predictions?.length || 0} prédiction
                {(project.predictions?.length || 0) > 1 ? 's' : ''}
              </div>
              {project.is_public && (
                <span className="px-2 py-1 text-xs bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                  Public
                </span>
              )}
            </div>

            {showShare && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <ProjectShare project={project} />
              </div>
            )}

            {project.predictions && project.predictions.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Prédictions ({project.predictions.length})
                </h3>
                <div className="space-y-2">
                  {project.predictions.map((predictionId, index) => (
                    <div
                      key={predictionId}
                      className="p-3 bg-slate-800/50 rounded border border-slate-700"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">
                          Prédiction #{index + 1}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/predictions/${predictionId}`)
                          }
                        >
                          Voir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 p-6 bg-slate-800/30 rounded border border-slate-700 text-center">
                <p className="text-slate-400 mb-4">
                  Aucune prédiction dans ce projet
                </p>
                <Button
                  onClick={() => router.push('/matches')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600"
                >
                  Ajouter des prédictions
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}





