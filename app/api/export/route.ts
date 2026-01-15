import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'json'

  // Authenticate user
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Fetch user's entries
    const { data: entries, error: entriesError } = await supabase
      .from('entries')
      .select('id, mood, energy, note, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (entriesError) {
      console.error('Error fetching entries:', entriesError)
      return NextResponse.json(
        { error: 'Failed to fetch entries' },
        { status: 500 }
      )
    }

    // Fetch user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('timezone, notification_pref, paused_until, created_at, updated_at')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
    }

    // Add email to profile data (only PII we export)
    const profileData = {
      email: user.email,
      ...(profile || {}),
    }

    if (format === 'csv') {
      // Generate CSV
      const csvRows = [
        // Header
        'id,mood,energy,note,created_at',
        // Data rows
        ...(entries || []).map((entry) => {
          // Sanitize note to prevent CSV injection
          let note = ''
          if (entry.note) {
            // Remove potential formula injection characters at the start
            let sanitizedNote = entry.note.trim()
            if (/^[=+\-@]/.test(sanitizedNote)) {
              sanitizedNote = "'" + sanitizedNote
            }
            // Escape quotes for CSV
            note = `"${sanitizedNote.replace(/"/g, '""')}"`
          }
          return `${entry.id},${entry.mood},${entry.energy},${note},${entry.created_at}`
        }),
      ]
      const csvContent = csvRows.join('\n')

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="moodily-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    } else {
      // Return JSON
      const jsonData = {
        profile: profileData,
        entries: entries || [],
        exported_at: new Date().toISOString(),
      }

      const jsonContent = JSON.stringify(jsonData, null, 2)

      return new NextResponse(jsonContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="moodily-export-${new Date().toISOString().split('T')[0]}.json"`,
        },
      })
    }
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
