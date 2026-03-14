import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const MODEL_CONFIG = {
  model: 'claude-3-5-haiku-20241022' as const,
  max_tokens: 1024,
}
