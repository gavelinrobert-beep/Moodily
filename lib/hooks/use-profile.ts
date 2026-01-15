import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { logError } from '@/lib/utils/error-logger'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export function useProfile() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        logError(new Error(error.message), { context: 'useProfile' })
        throw error
      }

      return data as Profile | null
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .upsert({ ...updates, user_id: user.id })
        .select()
        .single()

      if (error) {
        logError(new Error(error.message), { context: 'useUpdateProfile' })
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useDeleteAccount() {
  const supabase = createClient()

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Delete all user data from profiles and entries tables
      // RLS policies ensure users can only delete their own data
      await Promise.all([
        supabase.from('entries').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('user_id', user.id),
      ])

      // Note: Actual user account deletion from auth.users requires service role key
      // For now, we sign out after deleting user data
      // In production, implement an admin API endpoint to delete the auth user
      await supabase.auth.signOut()
    },
  })
}
