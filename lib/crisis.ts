const CRISIS_KEYWORDS = [
  '不想活', '想死', '去死', '自杀', '轻生', '活不下去',
  '结束生命', '消失算了', '死了算了', '不想存在',
]

export function detectCrisis(text: string): boolean {
  return CRISIS_KEYWORDS.some(keyword => text.includes(keyword))
}
