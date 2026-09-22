'use server'

import { createClient } from '@/utils/supabase/server'
import { contactSchema } from '@/lib/schemas'
import { limiter } from '@/utils/rate-limit'
import { headers } from 'next/headers'

export async function submitContactAction(prevState: any, formData: FormData) {
  try {
    // 1. IP-based Rate Limiting check
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') ?? '127.0.0.1'
    
    try {
      await limiter.check(5, ip) // Max 5 submissions per minute per IP
    } catch {
      return { success: false, error: 'Too many requests. Please try again later.' }
    }

    // 2. Extract and Validate via Zod Schema (including honeypot check)
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      website: formData.get('website'), // Honeypot field
    }

    const result = contactSchema.safeParse(rawData)
    if (!result.success) {
      return { success: false, error: result.error.issues[0].message }
    }

    const { name, email, message } = result.data

    // 3. Persist to Supabase
    const supabase = await createClient()
    const { error } = await supabase.from('contacts').insert({
      name,
      email,
      message,
    })

    if (error) {
      return { success: false, error: 'Failed to save inquiry. Please try again.' }
    }

    return { success: true, message: 'Thank you. Your message has been securely transmitted.' }
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' }
  }
}