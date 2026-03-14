import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CheckinPageClient } from './CheckinPageClient'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: { mode?: string }
}

export default async function CheckinPage({ searchParams }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const mode = searchParams.mode === 'feedback' ? 'feedback' : 'checkin'
  const today = new Date().toISOString().split('T')[0]

  // 如果是签到模式，检查今日是否已签到
  if (mode === 'checkin') {
    const { data: todayRecord } = await supabase
      .from('checkin_records').select('id').eq('user_id', user.id).eq('checkin_date', today).single()
    if (todayRecord) redirect('/home')
  }

  const { data: lastRecord } = await supabase
    .from('checkin_records').select('id').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single()

  return <CheckinPageClient mode={mode} lastCheckinId={lastRecord?.id} />
}
