'use server'

import { createClient } from '@/utils/supabase/server'
import { loginSchema, registerSchema, forgotPasswordSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const result = loginSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const { email, password } = result.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function registerAction(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    phoneNumber: formData.get('phoneNumber'),
  }

  const result = registerSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const { fullName, email, password, phoneNumber } = result.data

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone_number: phoneNumber,
      },
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, message: 'Registration successful! Please check your email for verification if required.' }
}

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const result = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  })

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message, message: '' }
  }

  const { email } = result.data
  const origin = (await (await import('next/headers')).headers()).get('origin')

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/auth/update-password`,
  })

  if (error) {
    return { success: false, error: error.message, message: '' }
  }

  return { success: true, error: '', message: 'Password recovery email sent. Please check your inbox.' }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}