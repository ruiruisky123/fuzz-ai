'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('请填写邮箱和密码'); return }
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('邮箱或密码不正确，请重试')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
      .from('profiles').select('onboarding_completed').eq('id', user!.id).single()

    router.push(profile?.onboarding_completed ? '/home' : '/onboarding')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#FEFCF5' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-1" style={{ fontFamily: '"Ma Shan Zheng", cursive', color: '#F4B942' }}>Fuzz</h1>
          <p className="text-sm" style={{ color: '#B5A48A' }}>和自己好好待一会儿</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="你的邮箱"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 outline-none transition-all"
            style={{
              background: '#FFF9E6', border: '1.5px solid #E8DFC8',
              borderRadius: '16px', color: '#2C2416', fontSize: '15px',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#F4B942'}
            onBlur={e => e.currentTarget.style.borderColor = '#E8DFC8'}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 outline-none transition-all pr-12"
              style={{
                background: '#FFF9E6', border: '1.5px solid #E8DFC8',
                borderRadius: '16px', color: '#2C2416', fontSize: '15px',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#F4B942'}
              onBlur={e => e.currentTarget.style.borderColor = '#E8DFC8'}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#B5A48A' }}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base font-medium">
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: '#7A6A52' }}>
          还没有账号？{' '}
          <Link href="/register" style={{ color: '#E8963A', fontWeight: 500 }}>去注册</Link>
        </p>
      </div>
    </div>
  )
}
