import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { getTodayRange, getThisWeekRange, getLastWeekRange, getUserTimezone } from '@/lib/utils/date'
import { trackEvent } from '@/lib/utils/analytics'
import { logError } from '@/lib/utils/error-logger'

type Entry = Database['public']['Tables']['entries']['Row']
type EntryInsert = Database['public']['Tables']['entries']['Insert']

export function useEntries(startDate?: Date, endDate?: Date) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['entries', startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false })

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString())
      }
      if (endDate) {
        query = query.lte('created_at', endDate.toISOString())
      }

      const { data, error } = await query

      if (error) {
        logError(new Error(error.message), { context: 'useEntries' })
        throw error
      }

      return data as Entry[]
    },
  })
}

export function useTodayEntry() {
  const timezone = getUserTimezone()
  const { start, end } = getTodayRange(timezone)
  
  return useEntries(start, end)
}

export function useWeeklyStats() {
  const supabase = createClient()
  const timezone = getUserTimezone()

  return useQuery({
    queryKey: ['weekly-stats'],
    queryFn: async () => {
      const thisWeek = getThisWeekRange(timezone)
      const lastWeek = getLastWeekRange(timezone)

      const [thisWeekData, lastWeekData] = await Promise.all([
        supabase
          .from('entries')
          .select('mood, energy')
          .gte('created_at', thisWeek.start.toISOString())
          .lte('created_at', thisWeek.end.toISOString()),
        supabase
          .from('entries')
          .select('mood, energy')
          .gte('created_at', lastWeek.start.toISOString())
          .lte('created_at', lastWeek.end.toISOString()),
      ])

      if (thisWeekData.error || lastWeekData.error) {
        logError(new Error('Failed to fetch weekly stats'))
        throw new Error('Failed to fetch weekly stats')
      }

      const calcAvg = (data: any[], field: 'mood' | 'energy') => {
        if (data.length === 0) return 0
        return data.reduce((sum, entry) => sum + entry[field], 0) / data.length
      }

      return {
        thisWeek: {
          avgMood: calcAvg(thisWeekData.data, 'mood'),
          avgEnergy: calcAvg(thisWeekData.data, 'energy'),
          count: thisWeekData.data.length,
        },
        lastWeek: {
          avgMood: calcAvg(lastWeekData.data, 'mood'),
          avgEnergy: calcAvg(lastWeekData.data, 'energy'),
          count: lastWeekData.data.length,
        },
      }
    },
  })
}

export function useStreak() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['streak'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        logError(new Error(error.message), { context: 'useStreak' })
        throw error
      }

      return data || { current_streak: 0, longest_streak: 0 }
    },
  })
}

export function useCreateEntry() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (entry: Omit<EntryInsert, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('entries')
        .insert({ ...entry, user_id: user.id })
        .select()
        .single()

      if (error) {
        logError(new Error(error.message), { context: 'useCreateEntry' })
        throw error
      }

      trackEvent({ 
        name: 'check_in', 
        properties: { mood: entry.mood, energy: entry.energy } 
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      queryClient.invalidateQueries({ queryKey: ['streak'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-stats'] })
    },
  })
}
