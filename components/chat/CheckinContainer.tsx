'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { CrisisBanner } from '../shared/CrisisBanner'
import { EmotionTag } from '../shared/EmotionTag'
import { ActionCard } from '../shared/ActionCard'
import { detectCrisis } from '@/lib/crisis'
import type { ChatMessage, CheckinCompletePayload, AIActionPayload, EmotionType } from '@/types'

interface CheckinContainerProps {
  mode: 'checkin' | 'feedback'
  lastCheckinId?: string
}

function parseAIResult(text: string): { displayText: string; result: AIActionPayload | null } {
  const match = text.match(/```json\n(\{[\s\S]*?\})\n```\s*$/)
  if (!match) return { displayText: text, result: null }
  try {
    const result = JSON.parse(match[1])
    return { displayText: text.replace(match[0], '').trim(), result }
  } catch {
    return { displayText: text, result: null }
  }
}

export function CheckinContainer({ mode }: CheckinContainerProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCrisis, setShowCrisis] = useState(false)
  const [checkinResult, setCheckinResult] = useState<CheckinCompletePayload | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      sendAIMessage([])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  async function sendAIMessage(msgs: ChatMessage[]) {
    setIsLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, mode }),
        signal: AbortSignal.timeout(30000),
      })

      if (!res.ok) throw new Error('API error')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              fullText += parsed.delta.text
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: fullText }
                return updated
              })
            }
          } catch {}
        }
      }

      const { displayText, result } = parseAIResult(fullText)
      if (displayText !== fullText) {
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: displayText }
          return updated
        })
      }

      if (result?.action === 'checkin_complete') {
        setCheckinResult(result as CheckinCompletePayload)
        await saveCheckin(result as CheckinCompletePayload, turnCount)
      } else if (result?.action === 'crisis_detected') {
        setShowCrisis(true)
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Fuzz 走神了一下，要不要再试试？'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSend(text: string) {
    if (detectCrisis(text)) setShowCrisis(true)

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setTurnCount(t => t + 1)
    await sendAIMessage(newMessages)
  }

  async function saveCheckin(result: CheckinCompletePayload, turns: number) {
    setIsSaving(true)
    try {
      await fetch('/api/checkin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emotion_tags: result.emotion_tags,
          summary: result.summary,
          micro_action: result.micro_action,
          conversation_turns: turns,
          crisis_detected: showCrisis,
        }),
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (checkinResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{ padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }}
      >
        <div className="card-doodle" style={{ padding: '24px', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', color: '#B5A48A', marginBottom: '12px' }}>今天的情绪</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {checkinResult.emotion_tags.map(tag => (
              <EmotionTag key={tag} emotion={tag as EmotionType} />
            ))}
          </div>
          <p style={{
            fontSize: '15px', color: '#7A6A52', fontStyle: 'italic',
            borderLeft: '3px solid #F4B942', paddingLeft: '12px',
          }}>
            {checkinResult.summary}
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <ActionCard action={checkinResult.micro_action} />
        </div>

        <button onClick={() => router.push('/home')} className="btn-primary w-full py-3 text-base">
          {isSaving ? '保存中...' : '回首页'}
        </button>
      </motion.div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', maxWidth: '480px', margin: '0 auto', width: '100%' }}>
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <ChatBubble variant={msg.role === 'assistant' ? 'ai' : 'user'} content={msg.content} />
          </motion.div>
        ))}
        {isLoading && <ChatBubble variant="ai" content="" isLoading />}
        {showCrisis && <CrisisBanner visible />}
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
        <ChatInput onSend={handleSend} disabled={isLoading || !!checkinResult} />
      </div>
    </div>
  )
}
