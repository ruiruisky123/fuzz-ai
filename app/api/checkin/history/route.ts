import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildMemoryContext } from '@/lib/memory'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase.from('checkin_records')
    .select('created_at, emotion_tags, summary, micro_action, action_completed')
    .eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)

  return NextResponse.json({ memory: buildMemoryContext(data || []) })
}
