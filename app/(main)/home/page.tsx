import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HomeClient } from './HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: history }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('checkin_records').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(7),
  ])

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const todayRecord = history?.find(r => r.checkin_date === today) || null
  const yesterdayRecord = history?.find(r => r.checkin_date === yesterday && r.micro_action && r.action_completed === null) || null

  return (
    <HomeClient
      profile={profile}
      history={history || []}
      todayRecord={todayRecord}
      yesterdayRecord={yesterdayRecord}
    />
  )
}
