'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/lib/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    // Vérifier que Supabase est configuré (vérification côté client)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured - showing auth buttons')
      if (mounted) {
        setLoading(false)
      }
      return
    }

    // Récupérer la session initiale avec timeout
    const initSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          if (mounted) {
            setError(sessionError.message)
            setLoading(false)
          }
          return
        }

        if (mounted) {
          setUser(session?.user ?? null)

          // Récupérer le profil si l'utilisateur est connecté
          if (session?.user) {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

              if (profileError && profileError.code !== 'PGRST116') {
                console.error('Profile error:', profileError)
              } else if (profileData) {
                setProfile(profileData)
              }
            } catch (err) {
              console.error('Error fetching profile:', err)
            }
          }

          setLoading(false)
        }
      } catch (err) {
        console.error('Error initializing session:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setLoading(false)
        }
      }
    }

    // Timeout de sécurité (5 secondes max)
    const timeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout')
        setLoading(false)
      }
    }, 5000)

    initSession()

    // Écouter les changements d'auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      setUser(session?.user ?? null)

      if (session?.user) {
        try {
          // Récupérer le profil
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setProfile(profileData || null)
        } catch (err) {
          console.error('Error fetching profile on auth change:', err)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
      clearTimeout(timeout)
    })

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  return { user, profile, loading, error }
}

