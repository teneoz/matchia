'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { UserProject } from '@/lib/types'
import { Calendar, Share2, Trash2, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ProjectCardProps {
  project: UserProject
  onEdit?: (project: UserProject) => void
  onDelete?: (id: string) => void
  onShare?: (project: UserProject) => void
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onShare,
}: ProjectCardProps) {
  const predictionCount = project.predictions?.length || 0

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{project.name}</CardTitle>
            {project.description && (
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            )}
          </div>
          {project.is_public && (
            <span className="ml-2 px-2 py-1 text-xs bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
              Public
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(project.created_at), 'd MMM yyyy', {
                  locale: fr,
                })}
              </span>
            </div>
            <div>
              {predictionCount} prédiction{predictionCount > 1 ? 's' : ''}
            </div>
          </div>

          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(project)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
            {onShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(project)}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(project.id)}
                className="text-red-400 hover:text-red-300 hover:border-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

