import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Profile {
  user_id: string
  timezone: string
  notification_pref: string
  paused_until: string | null
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current date in UTC (will adjust per user timezone later)
    const now = new Date()

    // Get all users who:
    // 1. Have email notifications enabled
    // 2. Are not paused or pause date has passed
    // Plus their entries for today (in their timezone)
    const { data: usersData, error: usersError } = await supabaseClient
      .rpc('get_users_needing_reminders')

    // If the function doesn't exist yet, fall back to the original approach
    if (usersError && usersError.message.includes('does not exist')) {
      // Fallback: Get profiles and check entries individually
      const today = now.toISOString().split('T')[0]
      
      const { data: profiles, error: profilesError } = await supabaseClient
        .from('profiles')
        .select('user_id, timezone, notification_pref, paused_until')
        .eq('notification_pref', 'email')
        .or(`paused_until.is.null,paused_until.lt.${today}`)

      if (profilesError) throw profilesError
      if (!profiles || profiles.length === 0) {
        return new Response(
          JSON.stringify({ message: 'No users to remind' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      let sentCount = 0
      let skippedCount = 0

      // Check each user for today's entry in their timezone
      for (const profile of profiles as Profile[]) {
        // Get user's current date in their timezone
        const userTimezone = profile.timezone || 'UTC'
        const userToday = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }))
        const userTodayStr = userToday.toISOString().split('T')[0]

        // Check if user has an entry today in their timezone
        const { data: entries, error: entriesError } = await supabaseClient
          .from('entries')
          .select('id, created_at')
          .eq('user_id', profile.user_id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (entriesError) {
          console.error(`Error checking entries for user ${profile.user_id}:`, entriesError)
          continue
        }

        // Check if any entry is from today in user's timezone
        const hasEntryToday = entries?.some((entry) => {
          const entryDate = new Date(entry.created_at)
          const entryDateInUserTz = new Date(entryDate.toLocaleString('en-US', { timeZone: userTimezone }))
          const entryDateStr = entryDateInUserTz.toISOString().split('T')[0]
          return entryDateStr === userTodayStr
        })

        // Skip if user already checked in today
        if (hasEntryToday) {
          skippedCount++
          continue
        }

        // Get user email
        const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(
          profile.user_id
        )

        if (userError || !userData?.user?.email) {
          console.error(`Error getting user ${profile.user_id}:`, userError)
          continue
        }

        // Send reminder email
        try {
          console.log(`Would send reminder to ${userData.user.email} (timezone: ${userTimezone})`)
          sentCount++
        } catch (emailError) {
          console.error(`Error sending email to ${userData.user.email}:`, emailError)
        }
      }

      return new Response(
        JSON.stringify({
          message: 'Reminders processed',
          sent: sentCount,
          skipped: skippedCount,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If we get here, we have data from the optimized query (future enhancement)
    return new Response(
      JSON.stringify({
        message: 'Reminders processed with optimized query',
        users: usersData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
