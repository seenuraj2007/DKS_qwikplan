import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return null
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  return match?.[1] ?? null
}

export function createSupabaseFromBearerToken(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }
  )
}

export async function createSupabaseFromCookies() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string, options: Record<string, unknown>) {
          ;(await cookieStore).set({ name, value, ...options })
        },
        async remove(name: string, options: Record<string, unknown>) {
          ;(await cookieStore).set({ name, value: '', ...options })
        },
      },
    }
  )
}

export async function getSupabaseClient(req?: Request) {
  const bearerToken = req ? getBearerToken(req) : null
  return bearerToken ? createSupabaseFromBearerToken(bearerToken) : await createSupabaseFromCookies()
}
