/**
 * Utilitaires pour construire et optimiser les prompts
 */

/**
 * Nettoie et optimise un prompt
 */
export function optimizePrompt(prompt: string): string {
  // Supprimer les espaces multiples
  let optimized = prompt.replace(/\s+/g, ' ').trim()

  // Supprimer les lignes vides multiples
  optimized = optimized.replace(/\n{3,}/g, '\n\n')

  return optimized
}

/**
 * Construit un prompt avec des variables
 */
export function buildPrompt(
  template: string,
  variables: Record<string, string | number | undefined>
): string {
  let prompt = template

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`
    const replacement = value !== undefined ? String(value) : ''
    prompt = prompt.replace(new RegExp(placeholder, 'g'), replacement)
  }

  return optimizePrompt(prompt)
}

/**
 * Ajoute du contexte utilisateur à un prompt
 */
export function addUserContext(
  prompt: string,
  context: {
    userName?: string
    favoriteTeams?: string[]
    language?: string
  }
): string {
  let enhanced = prompt

  if (context.userName) {
    enhanced = `Utilisateur: ${context.userName}\n\n${enhanced}`
  }

  if (context.favoriteTeams && context.favoriteTeams.length > 0) {
    enhanced = `${enhanced}\n\nNote: L'utilisateur suit particulièrement ces équipes: ${context.favoriteTeams.join(', ')}`
  }

  if (context.language && context.language !== 'fr') {
    enhanced = `${enhanced}\n\nNote: Réponds en ${context.language}`
  }

  return enhanced
}





