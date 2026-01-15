import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsContent } from './settings-content'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  return <SettingsContent />
}
