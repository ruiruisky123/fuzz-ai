interface CheckinRecordForMemory {
  created_at: string
  emotion_tags: string[]
  summary: string
  micro_action: string
  action_completed: boolean | null
}

export function buildMemoryContext(records: CheckinRecordForMemory[]): string {
  if (records.length === 0) return ''

  const lines = records.map((r) => {
    const date = new Date(r.created_at).toLocaleDateString('zh-CN', {
      month: 'long', day: 'numeric'
    })
    const completionNote = r.action_completed === true
      ? '（微行动已完成）'
      : r.action_completed === false
        ? '（微行动未完成）'
        : ''
    return `[${date}] 情绪：${r.emotion_tags.join('、')} | ${r.summary} | 微行动：${r.micro_action}${completionNote}`
  })

  return `以下是用户最近的签到记录（从新到旧）：
${lines.join('\n')}

请在对话中自然地融入这些记忆，不要机械地重复背诵，而是在合适时机自然提及（例如："上次你说..."）。`
}
