interface ChatBubbleProps {
  variant: 'ai' | 'user'
  content: string
  isLoading?: boolean
}

export function ChatBubble({ variant, content, isLoading }: ChatBubbleProps) {
  const isAI = variant === 'ai'

  return (
    <div style={{
      display: 'flex',
      justifyContent: isAI ? 'flex-start' : 'flex-end',
      marginBottom: '12px',
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '12px 16px',
        background: isAI ? '#FFFDF0' : 'rgba(244, 185, 66, 0.15)',
        border: `1.5px solid ${isAI ? '#E8DFC8' : 'rgba(244, 185, 66, 0.3)'}`,
        borderRadius: isAI ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
        fontSize: '15px',
        lineHeight: '1.7',
        color: '#2C2416',
      }}>
        {isLoading ? (
          <div className="dot-loading" style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 0' }}>
            <span /><span /><span />
          </div>
        ) : (
          <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{content}</p>
        )}
      </div>
    </div>
  )
}
