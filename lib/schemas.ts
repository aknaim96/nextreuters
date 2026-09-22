import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
})

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
  phoneNumber: z.string().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
  // Honeypot field to block automated spam bots
  website: z.string().max(0, 'Spam detected.').optional(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ContactFormValues = z.infer<typeof contactSchema>