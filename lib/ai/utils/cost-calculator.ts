/**
 * Calculateur de coûts pour les appels API Anthropic
 */

interface ModelPricing {
  input: number // Prix par 1M tokens
  output: number // Prix par 1M tokens
}

const PRICING: Record<string, ModelPricing> = {
  'claude-3-5-sonnet-20241022': {
    input: 3.0, // $3 per 1M input tokens
    output: 15.0, // $15 per 1M output tokens
  },
  'claude-3-opus-20240229': {
    input: 15.0,
    output: 75.0,
  },
  'claude-3-haiku-20240307': {
    input: 0.25,
    output: 1.25,
  },
}

/**
 * Calcule le coût d'un appel API
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = PRICING[model]
  if (!pricing) {
    console.warn(`Unknown model pricing for ${model}, using default`)
    return 0
  }

  const inputCost = (inputTokens / 1_000_000) * pricing.input
  const outputCost = (outputTokens / 1_000_000) * pricing.output

  return inputCost + outputCost
}

/**
 * Estime le coût d'un appel basé sur la longueur du prompt
 */
export function estimateCost(
  model: string,
  promptLength: number,
  estimatedOutputLength: number = 500
): number {
  // Estimation: ~4 caractères par token
  const inputTokens = Math.ceil(promptLength / 4)
  const outputTokens = Math.ceil(estimatedOutputLength / 4)

  return calculateCost(model, inputTokens, outputTokens)
}

/**
 * Formate un coût en USD
 */
export function formatCost(cost: number): string {
  return `$${cost.toFixed(6)}`
}





