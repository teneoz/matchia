'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import type { MatchAnalysis } from '@/lib/api/anthropic'

interface EnhancedPredictionCardProps extends MatchAnalysis {
  risks?: string[]
  recommendation?: string
  homeTeam: string
  awayTeam: string
  matchDate?: string
}

export function EnhancedPredictionCard({
  predictedHomeScore,
  predictedAwayScore,
  predictedWinner,
  confidenceScore,
  homeWinProbability,
  drawProbability,
  awayWinProbability,
  analysisText,
  keyFactors,
  risks,
  recommendation,
  homeTeam,
  awayTeam,
  matchDate,
}: EnhancedPredictionCardProps) {
  const getWinnerLabel = () => {
    if (predictedWinner === 'home') return homeTeam
    if (predictedWinner === 'away') return awayTeam
    return 'Match nul'
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 75) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">
              {homeTeam} vs {awayTeam}
            </CardTitle>
            {matchDate && (
              <CardDescription>
                {new Date(matchDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardDescription>
            )}
          </div>
          <Badge
            variant="outline"
            className={`${getConfidenceColor(confidenceScore)} text-white border-0`}
          >
            {confidenceScore}% confiance
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Prédit */}
        <div className="text-center py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {predictedHomeScore} - {predictedAwayScore}
          </div>
          <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Vainqueur prédit: {getWinnerLabel()}</span>
          </div>
        </div>

        {/* Probabilités */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Probabilités
          </h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Victoire {homeTeam}</span>
                <span className="font-semibold">{homeWinProbability}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${homeWinProbability}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Match nul</span>
                <span className="font-semibold">{drawProbability}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${drawProbability}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Victoire {awayTeam}</span>
                <span className="font-semibold">{awayWinProbability}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${awayWinProbability}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Analyse */}
        {analysisText && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Analyse
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {analysisText}
            </p>
          </div>
        )}

        {/* Facteurs Clés */}
        {keyFactors && keyFactors.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Facteurs Clés</h3>
            <ul className="space-y-2">
              {keyFactors.map((factor, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risques */}
        {risks && risks.length > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <AlertTriangle className="w-4 h-4" />
              Risques et Incertitudes
            </h3>
            <ul className="space-y-1">
              {risks.map((risk, i) => (
                <li
                  key={i}
                  className="text-sm text-orange-700 dark:text-orange-300"
                >
                  • {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommandation */}
        {recommendation && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">
              Recommandation
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {recommendation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

