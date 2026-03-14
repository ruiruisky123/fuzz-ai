import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase.from('checkin_records').upsert({
    user_id: user.id,
    checkin_date: today,
    emotion_tags: body.emotion_tags,
    summary: body.summary,
    micro_action: body.micro_action,
    conversation_turns: body.conversation_turns || 0,
    crisis_detected: body.crisis_detected || false,
  }, { onConflict: 'user_id,checkin_date' }).select('id, checkin_date').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
