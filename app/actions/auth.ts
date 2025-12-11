'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signUpSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
})

const signInSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
  }

  // Validation
  const validated = signUpSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      error: validated.error.errors[0].message,
    }
  }

  const { email, password, fullName } = validated.data

  // Inscription
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.user) {
    return { error: 'Erreur lors de l\'inscription' }
  }

  // Créer le profil manuellement si le trigger n'a pas fonctionné
  // (fallback si le trigger échoue)
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email || email,
        full_name: fullName,
      })
      .select()
      .single()

    // Si l'erreur est "duplicate key", c'est que le trigger a déjà créé le profil
    // C'est OK, on continue
    if (profileError && !profileError.message.includes('duplicate key')) {
      console.error('Error creating profile:', profileError)
      // On continue quand même, le trigger devrait avoir créé le profil
    }
  } catch (err) {
    console.error('Error in profile creation fallback:', err)
    // On continue quand même
  }

  revalidatePath('/')
  // Ne pas utiliser redirect() ici, la redirection sera gérée côté client
  return { success: true }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Validation
  const validated = signInSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      error: validated.error.errors[0].message,
    }
  }

  const { email, password } = validated.data

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.user) {
    return { error: 'Erreur lors de la connexion' }
  }

  revalidatePath('/')
  // Ne pas utiliser redirect() ici, la redirection sera gérée côté client
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  redirect('/login')
}

