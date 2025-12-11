import { ChatInterface } from '@/components/ai/ChatInterface'

export const metadata = {
  title: 'Assistant IA - FootPredict AI',
  description: 'Posez vos questions sur les matchs, prédictions et analyses',
}

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Assistant IA
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Obtenez des réponses intelligentes sur le football, les matchs et les
          prédictions
        </p>
      </div>

      <div className="h-[calc(100vh-200px)] min-h-[600px]">
        <ChatInterface />
      </div>
    </div>
  )
}

