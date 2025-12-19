'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Copy } from 'lucide-react'
import type { UserProject } from '@/lib/types'

interface ProjectShareProps {
  project: UserProject
}

export function ProjectShare({ project }: ProjectShareProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/projects/shared/${project.share_token}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!project.is_public) {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-sm text-yellow-400">
          Ce projet n'est pas public. Activez le partage public dans les
          paramètres du projet pour générer un lien de partage.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">
          Lien de partage
        </label>
        <div className="flex gap-2">
          <Input value={shareUrl} readOnly className="flex-1" />
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="min-w-[100px]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copié
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copier
              </>
            )}
          </Button>
        </div>
      </div>
      <p className="text-sm text-slate-400">
        Partagez ce lien pour permettre à d'autres de voir votre projet
        public.
      </p>
    </div>
  )
}





