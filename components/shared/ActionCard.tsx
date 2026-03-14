import { Check } from 'lucide-react'

interface ActionCardProps {
  action: string
  completed?: boolean
  onComplete?: () => void
}

export function ActionCard({ action, completed, onComplete }: ActionCardProps) {
  return (
    <div style={{
      background: '#FFFDF0',
      border: '1.5px solid #E8DFC8',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      borderLeft: '4px solid #E8963A',
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '13px', color: '#B5A48A', marginBottom: '4px' }}>今日微行动</p>
        <p style={{ fontSize: '15px', color: '#2C2416', fontWeight: 500 }}>{action}</p>
      </div>
      {onComplete && (
        <button onClick={onComplete}
          style={{
            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
            background: completed ? '#52C41A' : 'transparent',
            border: `2px solid ${completed ? '#52C41A' : '#E8DFC8'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s ease',
          }}>
          {completed && <Check size={14} color="white" />}
        </button>
      )}
    </div>
  )
}
