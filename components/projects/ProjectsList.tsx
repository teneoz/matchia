'use client'

import { useProjects } from '@/hooks/useProjects'
import { ProjectCard } from './ProjectCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectForm } from './ProjectForm'
import { Card } from '@/components/ui/card'

export function ProjectsList() {
  const { projects, loading, error, createProject, updateProject, deleteProject } =
    useProjects()
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const router = useRouter()

  const handleCreate = async (data: {
    name: string
    description?: string
    is_public?: boolean
  }) => {
    await createProject(data)
    setShowCreateForm(false)
  }

  const handleUpdate = async (
    id: string,
    data: {
      name: string
      description?: string
      is_public?: boolean
    }
  ) => {
    await updateProject(id, data)
    setEditingProject(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      await deleteProject(id)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-400">
        Chargement des projets...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 text-red-400 p-4 rounded border border-red-500/20">
        Erreur: {error}
      </div>
    )
  }

  if (projects.length === 0 && !showCreateForm) {
    return (
      <Card className="p-12 text-center">
        <p className="text-slate-400 mb-4">
          Vous n'avez pas encore de projet.
        </p>
        <button
          onClick={() => setShowCreateForm(true)}
          className="text-emerald-400 hover:text-emerald-300"
        >
          Créer votre premier projet
        </button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {showCreateForm && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Créer un nouveau projet
          </h2>
          <ProjectForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          if (editingProject === project.id) {
            return (
              <Card key={project.id} className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Modifier le projet
                </h2>
                <ProjectForm
                  project={project}
                  onSubmit={async (data) => {
                    await handleUpdate(project.id, data)
                  }}
                  onCancel={() => setEditingProject(null)}
                />
              </Card>
            )
          }

          return (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => setEditingProject(project.id)}
              onDelete={handleDelete}
              onShare={() => router.push(`/projects/${project.id}/share`)}
            />
          )
        })}
      </div>
    </div>
  )
}





