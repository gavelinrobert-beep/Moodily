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

    // Get current date in UTC
    const today = new Date().toISOString().split('T')[0]

    // Get all users who:
    // 1. Have email notifications enabled
    // 2. Are not paused or pause date has passed
    // 3. Haven't checked in today
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('user_id, timezone, notification_pref, paused_until')
      .eq('notification_pref', 'email')
      .or(`paused_until.is.null,paused_until.lt.${today}`)

    if (profilesError) {
      throw profilesError
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users to remind' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let sentCount = 0
    let skippedCount = 0

    // Check each user for today's entry
    for (const profile of profiles as Profile[]) {
      // Check if user has an entry today
      const { data: entries, error: entriesError } = await supabaseClient
        .from('entries')
        .select('id')
        .eq('user_id', profile.user_id)
        .gte('created_at', `${today}T00:00:00Z`)
        .limit(1)

      if (entriesError) {
        console.error(`Error checking entries for user ${profile.user_id}:`, entriesError)
        continue
      }

      // Skip if user already checked in today
      if (entries && entries.length > 0) {
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
      // Note: In production, you would integrate with an email service like SendGrid, Resend, etc.
      // For this MVP, we'll use Supabase's auth.admin.inviteUserByEmail as a placeholder
      // or you can integrate with your preferred email service
      
      try {
        // Track reminder sent event
        console.log(`Would send reminder to ${userData.user.email}`)
        
        // In production, integrate with email service:
        // await sendEmail({
        //   to: userData.user.email,
        //   subject: 'Time for your daily Moodily check-in',
        //   html: `
        //     <h2>Don't break your streak!</h2>
        //     <p>Take 10 seconds to log your mood and energy for today.</p>
        //     <a href="${Deno.env.get('APP_URL')}/dashboard">Check in now</a>
        //   `
        // })
        
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
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
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
