'use client'

import { useRouter } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import { ProjectForm } from './ProjectForm'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

export function NewProjectForm() {
  const router = useRouter()
  const { createProject } = useProjects()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: {
    name: string
    description?: string
    is_public?: boolean
  }) => {
    setLoading(true)
    try {
      const project = await createProject(data)
      if (project) {
        router.push(`/projects/${project.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <ProjectForm onSubmit={handleSubmit} loading={loading} />
    </Card>
  )
}

