'use client'

import { useState, useEffect, useCallback } from 'react'
import type { UserProject } from '@/lib/types'

interface UseProjectsReturn {
  projects: UserProject[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createProject: (data: {
    name: string
    description?: string
    predictions?: string[]
    settings?: Record<string, unknown>
    is_public?: boolean
  }) => Promise<UserProject | null>
  updateProject: (
    id: string,
    data: Partial<UserProject>
  ) => Promise<UserProject | null>
  deleteProject: (id: string) => Promise<boolean>
}

export function useProjects(includePublic = false): UseProjectsReturn {
  const [projects, setProjects] = useState<UserProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const url = includePublic
        ? '/api/projects?include_public=true'
        : '/api/projects'
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const data = await response.json()
      setProjects(data.projects || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [includePublic])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const createProject = useCallback(
    async (projectData: {
      name: string
      description?: string
      predictions?: string[]
      settings?: Record<string, unknown>
      is_public?: boolean
    }): Promise<UserProject | null> => {
      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create project')
        }

        const data = await response.json()
        await fetchProjects() // Refresh list
        return data.project
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        return null
      }
    },
    [fetchProjects]
  )

  const updateProject = useCallback(
    async (
      id: string,
      updateData: Partial<UserProject>
    ): Promise<UserProject | null> => {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update project')
        }

        const data = await response.json()
        await fetchProjects() // Refresh list
        return data.project
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        return null
      }
    },
    [fetchProjects]
  )

  const deleteProject = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to delete project')
        }

        await fetchProjects() // Refresh list
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        return false
      }
    },
    [fetchProjects]
  )

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
}





