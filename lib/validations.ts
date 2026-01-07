import { z } from 'zod'

export const generateRequestSchema = z.object({
  niche: z.string().min(1, 'Niche is required').max(100, 'Niche too long').trim(),
  audience: z.string().max(100, 'Audience too long').optional().default(''),
  platform: z.enum(['instagram', 'facebook', 'linkedin', 'twitter', 'youtube']),
  goal: z.enum(['sales', 'brand', 'engagement', 'leads']),
  isDemo: z.boolean().optional().default(false),
  regenerate: z.enum(['full', 'hook', 'script', 'angle']).optional()
})

export const demoGenerateRequestSchema = z.object({
  niche: z.string().min(1, 'Niche is required').max(100).trim(),
  audience: z.string().max(100).optional().default(''),
  platform: z.string().min(1, 'Platform is required').max(50).trim(),
  goal: z.string().min(1, 'Goal is required').max(100).trim()
})

export const feedbackRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
  feedbackText: z.string().min(1, 'Feedback is required').max(2000, 'Feedback too long').trim(),
  niche: z.string().max(100).optional(),
  platform: z.string().max(50).optional()
})
