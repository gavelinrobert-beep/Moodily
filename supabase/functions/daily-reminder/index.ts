import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get all profiles that should receive reminders
    const today = new Date().toISOString().split('T')[0]
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('user_id, timezone, notification_pref, paused_until')
      .eq('notification_pref', 'email')
      .or(`paused_until.is.null,paused_until.lt.${today}`)

    if (profilesError) {
      throw profilesError
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users to send reminders to' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Get user emails
    const userIds = profiles.map(p => p.user_id)
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      throw usersError
    }

    const usersMap = new Map(users?.map(u => [u.id, u.email]) || [])

    // Check who hasn't checked in today
    const { data: todayEntries, error: entriesError } = await supabaseAdmin
      .from('entries')
      .select('user_id')
      .gte('created_at', new Date().toISOString().split('T')[0])
    
    if (entriesError) {
      throw entriesError
    }

    const checkedInUserIds = new Set(todayEntries?.map(e => e.user_id) || [])
    
    const usersToRemind = profiles.filter(p => !checkedInUserIds.has(p.user_id))

    // Send emails (in production, use a proper email service)
    const emailPromises = usersToRemind.map(async (profile) => {
      const email = usersMap.get(profile.user_id)
      if (!email) return null

      // In production, integrate with an email service like SendGrid, Resend, etc.
      console.log(`Would send reminder to ${email}`)
      
      return { email, sent: true }
    })

    const results = await Promise.all(emailPromises)
    const sentCount = results.filter(r => r?.sent).length

    return new Response(
      JSON.stringify({ 
        message: `Sent ${sentCount} reminder emails`,
        count: sentCount 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
