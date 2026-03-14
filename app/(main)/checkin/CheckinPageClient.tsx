'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CheckinContainer } from '@/components/chat/CheckinContainer'

interface Props {
  mode: 'checkin' | 'feedback'
  lastCheckinId?: string
}

export function CheckinPageClient({ mode, lastCheckinId }: Props) {
  const router = useRouter()
  const today = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FEFCF5' }}>
      {/* 顶部导航 */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '12px 16px',
        borderBottom: '1.5px solid #E8DFC8', background: '#FEFCF5',
        flexShrink: 0,
      }}>
        <button onClick={() => router.push('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#7A6A52' }}>
          <ArrowLeft size={20} />
        </button>
        <p style={{ flex: 1, textAlign: 'center', fontSize: '14px', color: '#B5A48A' }}>
          {mode === 'feedback' ? '微行动反馈' : today}
        </p>
        <div style={{ width: '28px' }} />
      </div>

      {/* 对话区 */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <CheckinContainer mode={mode} lastCheckinId={lastCheckinId} />
      </div>
    </div>
  )
}
