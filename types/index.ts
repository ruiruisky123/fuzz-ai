export type EmotionType = 'anxiety' | 'empty' | 'low' | 'calm' | 'happy' | 'stressed' | 'confused'

export const EMOTION_LABELS: Record<EmotionType, string> = {
  anxiety: '焦虑',
  empty: '空虚',
  low: '低落',
  calm: '平静',
  happy: '愉悦',
  stressed: '压力',
  confused: '迷茫',
}

export const EMOTION_COLORS: Record<EmotionType, { bg: string; text: string }> = {
  anxiety:  { bg: '#FFF0D6', text: '#C17A2A' },
  empty:    { bg: '#EEF2FF', text: '#4B5FA6' },
  low:      { bg: '#F5F0FF', text: '#7C5CBF' },
  calm:     { bg: '#F0FAF5', text: '#2D8A5E' },
  happy:    { bg: '#FFFACC', text: '#B8860B' },
  stressed: { bg: '#FFF0EE', text: '#C0392B' },
  confused: { bg: '#F5F5F5', text: '#666666' },
}

export interface EmotionTagData {
  type: EmotionType
  label: string
}

export interface Profile {
  id: string
  nickname: string
  emotion_preferences: string[]
  onboarding_completed: boolean
  checkin_count: number
  created_at: string
  updated_at: string
}

export interface CheckinRecord {
  id: string
  user_id: string
  emotion_tags: string[]
  summary: string
  micro_action: string
  action_completed: boolean | null
  conversation_turns: number
  crisis_detected: boolean
  checkin_date: string
  created_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface SaveCheckinRequest {
  emotion_tags: string[]
  summary: string
  micro_action: string
  conversation_turns: number
  crisis_detected: boolean
}

export interface CheckinCompletePayload {
  action: 'checkin_complete'
  emotion_tags: string[]
  summary: string
  micro_action: string
}

export interface FeedbackCompletePayload {
  action: 'feedback_complete'
  action_completed: boolean
}

export interface CrisisPayload {
  action: 'crisis_detected'
}

export type AIActionPayload = CheckinCompletePayload | FeedbackCompletePayload | CrisisPayload
