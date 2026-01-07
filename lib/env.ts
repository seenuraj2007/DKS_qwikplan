const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'GROQ_API_KEY'
] as const

const optionalEnvVars = [
  'RESEND_API_KEY',
  'FEEDBACK_TO_EMAILS',
  'RESEND_FROM',
  'CACHE_ENABLED',
  'CACHE_TTL_MULTIPLIER'
] as const

type EnvVar = (typeof requiredEnvVars)[number] | (typeof optionalEnvVars)[number]

export function validateEnv() {
  const missing: EnvVar[] = []
  const empty: EnvVar[] = []
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    } else if (process.env[envVar] === '') {
      empty.push(envVar)
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
  }
  
  if (empty.length > 0) {
    console.warn(`Empty environment variables: ${empty.join(', ')}`)
  }
  
  return { missing, empty }
}

export function getEnvVar(key: EnvVar): string {
  const value = process.env[key]
  if (!value) {
    if (requiredEnvVars.includes(key as any)) {
      throw new Error(`Required environment variable ${key} is not set`)
    }
    return ''
  }
  return value
}

export function getCacheConfig(): { enabled: boolean; ttlMultiplier: number } {
  return {
    enabled: process.env.CACHE_ENABLED !== 'false',
    ttlMultiplier: Number(process.env.CACHE_TTL_MULTIPLIER || '1')
  }
}

if (typeof window === 'undefined') {
  try {
    validateEnv()
  } catch (error) {
    console.error('Environment validation failed:', error)
  }
}
