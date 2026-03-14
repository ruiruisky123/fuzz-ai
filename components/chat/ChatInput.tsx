'use client'
import { useState, useRef } from 'react'
import { SendHorizonal } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSend() {
    const msg = value.trim()
    if (!msg || disabled) return
    onSend(msg)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }

  return (
    <div style={{
      display: 'flex', gap: '10px', alignItems: 'flex-end',
      padding: '12px 16px',
      background: '#FEFCF5',
      borderTop: '1.5px solid #E8DFC8',
    }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="说说你的感受..."
        rows={1}
        style={{
          flex: 1, resize: 'none', outline: 'none',
          background: '#FFF9E6', border: '1.5px solid #E8DFC8',
          borderRadius: '16px', padding: '10px 14px',
          fontSize: '15px', color: '#2C2416', lineHeight: '1.6',
          fontFamily: '"Noto Sans SC", sans-serif',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.currentTarget.style.borderColor = '#F4B942'}
        onBlur={e => e.currentTarget.style.borderColor = '#E8DFC8'}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        style={{
          width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
          background: value.trim() && !disabled ? '#F4B942' : '#E8DFC8',
          border: 'none', cursor: value.trim() && !disabled ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s ease',
        }}
      >
        <SendHorizonal size={18} color={value.trim() && !disabled ? '#2C2416' : '#B5A48A'} />
      </button>
    </div>
  )
}
