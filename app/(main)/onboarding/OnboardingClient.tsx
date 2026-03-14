'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { EmotionTag } from '@/components/shared/EmotionTag'
import { createClient } from '@/lib/supabase/client'
import type { EmotionType } from '@/types'

const EMOTIONS: EmotionType[] = ['anxiety', 'empty', 'low', 'calm', 'happy', 'stressed', 'confused']

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<EmotionType[]>([])
  const [loading, setLoading] = useState(false)

  function toggleEmotion(e: EmotionType) {
    setSelected(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e])
  }

  async function complete(toChakin: boolean) {
    setLoading(true)
    // 先后台更新 profile，不阻塞导航
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const labels: Record<string, string> = {
          anxiety: '焦虑', empty: '空虚', low: '低落',
          calm: '平静', happy: '愉悦', stressed: '压力', confused: '迷茫'
        }
        supabase.from('profiles').update({
          onboarding_completed: true,
          emotion_preferences: selected.map(e => labels[e] ?? e),
        }).eq('id', session.user.id).then(() => {})
      }
    })
    // 设置 cookie 让中间件放行，然后立即导航
    document.cookie = 'onboarding_done=1; path=/; max-age=2592000'
    router.push(toChakin ? '/checkin' : '/home')
  }

  const steps = [
    // Step 0: 欢迎
    <motion.div key={0} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '0 20px' }}>
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>✦</div>
      <h1 style={{ fontFamily: '"Ma Shan Zheng", cursive', fontSize: '32px', color: '#F4B942', marginBottom: '16px' }}>
        嗨，我是 Fuzz
      </h1>
      <p style={{ fontSize: '16px', color: '#7A6A52', lineHeight: '1.8', marginBottom: '32px' }}>
        我不是心理医生，也不是角色扮演。<br />
        我只是一个愿意每天陪你聊聊的朋友。<br />
        每次 3 分钟，帮你理清情绪，找到一个今天能做的小事。
      </p>
      <button onClick={() => setStep(1)} className="btn-primary px-8 py-3 text-base">
        开始认识彼此 →
      </button>
    </motion.div>,

    // Step 1: 情绪偏好
    <motion.div key={1} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '0 20px' }}>
      <h2 style={{ fontFamily: '"Ma Shan Zheng", cursive', fontSize: '24px', color: '#2C2416', marginBottom: '8px', textAlign: 'center' }}>
        你最近常有哪些感受？
      </h2>
      <p style={{ fontSize: '14px', color: '#B5A48A', textAlign: 'center', marginBottom: '28px' }}>
        至少选一个，可以多选
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
        {EMOTIONS.map(e => (
          <EmotionTag key={e} emotion={e} size="md" selected={selected.includes(e)} onClick={() => toggleEmotion(e)} />
        ))}
      </div>
      <button onClick={() => setStep(2)} disabled={selected.length === 0} className="btn-primary w-full py-3 text-base" style={{ opacity: selected.length === 0 ? 0.5 : 1 }}>
        选好了
      </button>
    </motion.div>,

    // Step 2: 开始签到
    <motion.div key={2} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '0 20px' }}>
      <h2 style={{ fontFamily: '"Ma Shan Zheng", cursive', fontSize: '28px', color: '#2C2416', marginBottom: '12px' }}>
        今天怎么样？
      </h2>
      <p style={{ fontSize: '15px', color: '#7A6A52', lineHeight: '1.8', marginBottom: '32px' }}>
        每天只需要 3 分钟，<br />和我说说你的感受
      </p>
      <button onClick={() => complete(true)} disabled={loading} className="btn-primary w-full py-3 text-base mb-4">
        {loading ? '准备中...' : '开始今天的签到 →'}
      </button>
      <button onClick={() => complete(false)} style={{ background: 'none', border: 'none', color: '#B5A48A', fontSize: '14px', cursor: 'pointer' }}>
        先去首页看看
      </button>
    </motion.div>,
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FEFCF5', maxWidth: '480px', margin: '0 auto', padding: '40px 0' }}>
      {/* 进度点 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: i === step ? '24px' : '8px', height: '8px',
            borderRadius: '4px',
            background: i <= step ? '#F4B942' : '#E8DFC8',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <div style={{ width: '100%' }}>{steps[step]}</div>
      </AnimatePresence>
    </div>
  )
}
