import { SupabaseClient } from '@supabase/supabase-js'
import type { UserProfile } from '../types'

export interface CreateProfileInput {
  userId: string
  planUsage?: number
  monthlyLimit?: number
  planType?: 'free' | 'pro' | 'enterprise'
}

export interface UpdateProfileInput {
  planUsage?: number
  monthlyLimit?: number
  planType?: 'free' | 'pro' | 'enterprise'
}

export class UserService {
  constructor(private supabase: SupabaseClient) {}

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data as UserProfile
  }

  async createUserProfile(input: CreateProfileInput): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert({
        user_id: input.userId,
        plan_usage: input.planUsage ?? 0,
        monthly_limit: input.monthlyLimit ?? 50,
        plan_type: input.planType ?? 'free'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user profile:', error)
      return null
    }

    return data as UserProfile
  }

  async getOrCreateProfile(userId: string): Promise<{ profile: UserProfile; isNew: boolean }> {
    const existingProfile = await this.getUserProfile(userId)

    if (existingProfile) {
      return { profile: existingProfile, isNew: false }
    }

    const newProfile = await this.createUserProfile({ userId })
    if (!newProfile) {
      throw new Error('Failed to create user profile')
    }

    return { profile: newProfile, isNew: true }
  }

  async updateProfile(profileId: string, input: UpdateProfileInput): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(input)
      .eq('id', profileId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }

    return data as UserProfile
  }

  async incrementUsage(profileId: string): Promise<UserProfile | null> {
    const profile = await this.getUserProfileById(profileId)
    if (!profile) {
      return null
    }

    return this.updateProfile(profileId, { planUsage: profile.plan_usage + 1 })
  }

  async getUserProfileById(profileId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single()

    if (error) {
      console.error('Error fetching profile by ID:', error)
      return null
    }

    return data as UserProfile
  }

  async hasReachedLimit(userId: string): Promise<boolean> {
    const profile = await this.getUserProfile(userId)
    if (!profile) {
      return false
    }

    return profile.plan_usage >= profile.monthly_limit
  }

  async deleteUserData(userId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.rpc('delete_user_data', {
      user_id: userId
    })

    if (error) {
      console.error('Error deleting user data:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }
}
