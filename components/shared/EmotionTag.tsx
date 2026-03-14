import { EMOTION_COLORS, EMOTION_LABELS, type EmotionType } from '@/types'

interface EmotionTagProps {
  emotion: EmotionType
  size?: 'sm' | 'md'
  selected?: boolean
  onClick?: () => void
}

export function EmotionTag({ emotion, size = 'md', selected, onClick }: EmotionTagProps) {
  const colors = EMOTION_COLORS[emotion]
  const label = EMOTION_LABELS[emotion]
  const rotations = { anxiety: -1, empty: 1, low: -1, calm: 1, happy: -1, stressed: 1, confused: -1 }
  const rotate = rotations[emotion]

  return (
    <span
      onClick={onClick}
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1.5px solid ${selected ? colors.text : colors.text + '4D'}`,
        borderRadius: '12px',
        fontSize: size === 'sm' ? '12px' : '14px',
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
        display: 'inline-block',
        transform: `rotate(${rotate}deg)`,
        fontWeight: selected ? 600 : 400,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: selected ? `2px 2px 0 ${colors.text}33` : 'none',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </span>
  )
}
