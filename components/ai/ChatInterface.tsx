'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2, Bot, User } from 'lucide-react'
import type { ChatMessage } from '@/lib/types'

interface ChatInterfaceProps {
  conversationId?: string
  onConversationChange?: (id: string) => void
}

export function ChatInterface({ conversationId, onConversationChange }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId)

  // Charger l'historique si conversationId existe
  useEffect(() => {
    if (currentConversationId) {
      loadConversation(currentConversationId)
    }
  }, [currentConversationId])

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/ai/chat/conversations/${id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages)
        }
      } else if (response.status === 401) {
        // Rediriger vers login si non authentifié
        window.location.href = '/login'
      }
    } catch (err) {
      console.error('Error loading conversation:', err)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId: currentConversationId,
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Rediriger vers login si non authentifié
          window.location.href = '/login'
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'envoi du message')
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      }

      setMessages([...newMessages, assistantMessage])

      // Mettre à jour l'ID de conversation si c'est une nouvelle conversation
      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId)
        onConversationChange?.(data.conversationId)
      }
    } catch (err) {
      console.error('Chat error:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      // Retirer le message utilisateur en cas d'erreur
      setMessages(messages)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h2 className="font-semibold">Assistant IA FootPredict</h2>
        </div>
        <p className="text-sm text-emerald-50 mt-1">
          Posez vos questions sur les matchs, prédictions et analyses
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Bienvenue ! 👋</p>
            <p className="text-sm">
              Posez-moi une question sur le football, les matchs ou les prédictions.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <p className="font-medium">Exemples de questions :</p>
              <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                <li>"Qui va gagner entre PSG et OM ?"</li>
                <li>"Explique-moi cette prédiction"</li>
                <li>"Quelle équipe a la meilleure forme en Ligue 1 ?"</li>
              </ul>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.role === 'user'
                    ? 'text-emerald-50'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-slate-700 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span className="text-gray-600 dark:text-gray-400">
                  L'IA réfléchit...
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-800 dark:text-red-200">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-gray-50 dark:bg-slate-800">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question..."
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
        </p>
      </div>
    </div>
  )
}

