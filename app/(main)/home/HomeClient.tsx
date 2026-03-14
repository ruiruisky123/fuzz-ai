'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { EmotionTag } from '@/components/shared/EmotionTag'
import { ActionCard } from '@/components/shared/ActionCard'
import type { Profile, CheckinRecord, EmotionType } from '@/types'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 12) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  if (h < 22) return '晚上好'
  return '夜深了'
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

interface HomeClientProps {
  profile: Profile | null
  history: CheckinRecord[]
  todayRecord: CheckinRecord | null
  yesterdayRecord: CheckinRecord | null
}

export function HomeClient({ profile, history, todayRecord, yesterdayRecord }: HomeClientProps) {
  const router = useRouter()
  const nickname = profile?.nickname || '你'

  const cardState = todayRecord
    ? 'completed_today'
    : yesterdayRecord
      ? 'feedback_pending'
      : 'idle'

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 20px', minHeight: '100vh' }}>
      {/* 顶部问候 */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: '"Ma Shan Zheng", cursive', fontSize: '24px', color: '#2C2416' }}>
          {getGreeting()}，{nickname}
        </h1>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: '#F4B942', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', fontWeight: 700, color: '#2C2416',
          border: '2px solid #2C2416', flexShrink: 0,
        }}>
          {nickname[0]}
        </div>
      </motion.div>

      {/* 签到入口卡片 */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card-doodle" style={{ padding: '20px', marginBottom: '24px' }}>

        {cardState === 'feedback_pending' && yesterdayRecord && (
          <div>
            <p style={{ fontSize: '13px', color: '#E8963A', fontWeight: 500, marginBottom: '12px' }}>
              昨天的微行动，完成了吗？
            </p>
            <ActionCard action={yesterdayRecord.micro_action} />
            <button onClick={() => router.push('/checkin?mode=feedback')}
              className="btn-primary w-full py-3 text-base mt-4">
              告诉 Fuzz 我的感受
            </button>
          </div>
        )}

        {cardState === 'completed_today' && todayRecord && (
          <div>
            <p style={{ fontSize: '13px', color: '#B5A48A', marginBottom: '10px' }}>今天已签到</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {todayRecord.emotion_tags.map(tag => (
                <EmotionTag key={tag} emotion={tag as EmotionType} size="sm" />
              ))}
            </div>
            <p style={{ fontSize: '15px', color: '#7A6A52', marginBottom: '16px', fontStyle: 'italic' }}>
              {todayRecord.summary}
            </p>
            {todayRecord.micro_action && (
              <ActionCard action={todayRecord.micro_action} completed={todayRecord.action_completed === true} />
            )}
          </div>
        )}

        {cardState === 'idle' && (
          <div>
            <p style={{ fontSize: '16px', color: '#2C2416', marginBottom: '8px', fontWeight: 500 }}>
              今天还没来打个招呼
            </p>
            <p style={{ fontSize: '14px', color: '#B5A48A', marginBottom: '16px' }}>
              3 分钟，说说今天怎么样？
            </p>
            <button onClick={() => router.push('/checkin')} className="btn-primary w-full py-3 text-base">
              开始今日签到 →
            </button>
          </div>
        )}
      </motion.div>

      {/* 历史列表 */}
      <div>
        <h2 style={{ fontFamily: '"Ma Shan Zheng", cursive', fontSize: '18px', color: '#2C2416', marginBottom: '14px' }}>
          最近的心情
        </h2>

        {history.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#B5A48A', textAlign: 'center', padding: '24px 0' }}>
            签到记录会出现在这里
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((record, i) => (
              <motion.div key={record.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                style={{
                  background: '#FFFDF0', border: '1.5px solid #E8DFC8', borderRadius: '16px',
                  padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start',
                }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#B5A48A' }}>{formatDate(record.checkin_date)}</span>
                    {record.action_completed === true && (
                      <span style={{ fontSize: '11px', color: '#52C41A' }}>✓ 微行动完成</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                    {record.emotion_tags.slice(0, 2).map(tag => (
                      <EmotionTag key={tag} emotion={tag as EmotionType} size="sm" />
                    ))}
                  </div>
                  <p style={{ fontSize: '14px', color: '#7A6A52', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {record.summary}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
