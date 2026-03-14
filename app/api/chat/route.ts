import { NextRequest } from 'next/server'
import { anthropic, MODEL_CONFIG } from '@/lib/anthropic'
import { buildCheckinSystemPrompt, buildFeedbackSystemPrompt } from '@/lib/prompts'
import { buildMemoryContext } from '@/lib/memory'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { messages, mode } = await req.json()

  const [{ data: profile }, { data: history }] = await Promise.all([
    supabase.from('profiles').select('nickname, emotion_preferences, checkin_count').eq('id', user.id).single(),
    supabase.from('checkin_records').select('created_at, emotion_tags, summary, micro_action, action_completed').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
  ])

  const memoryContext = buildMemoryContext(history || [])

  let systemPrompt: string
  if (mode === 'feedback' && history && history.length > 0) {
    const last = history[0]
    systemPrompt = buildFeedbackSystemPrompt({
      nickname: profile?.nickname || '你',
      lastCheckin: {
        date: new Date(last.created_at).toLocaleDateString('zh-CN'),
        emotionSummary: last.summary,
        microAction: last.micro_action,
        emotionTags: last.emotion_tags,
      },
      memoryContext,
    })
  } else {
    systemPrompt = buildCheckinSystemPrompt({
      nickname: profile?.nickname || '你',
      memoryContext,
      userEmotionPreferences: profile?.emotion_preferences || [],
      isFirstCheckin: (profile?.checkin_count || 0) === 0,
    })
  }

  const stream = anthropic.messages.stream({
    ...MODEL_CONFIG,
    system: systemPrompt,
    messages,
  })

  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
