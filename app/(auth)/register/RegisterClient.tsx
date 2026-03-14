'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname || !email || !password) { setError('请填写所有字段'); return }
    if (password.length < 8) { setError('密码至少8位'); return }
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signUp({
      email, password,
      options: { data: { nickname } }
    })

    if (authError) {
      setError(authError.message === 'User already registered' ? '该邮箱已注册' : '注册失败，请重试')
      setLoading(false)
      return
    }

    router.push('/onboarding')
    router.refresh()
  }

  const inputStyle = {
    background: '#FFF9E6', border: '1.5px solid #E8DFC8',
    borderRadius: '16px', color: '#2C2416', fontSize: '15px',
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#FEFCF5' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-1" style={{ fontFamily: '"Ma Shan Zheng", cursive', color: '#F4B942' }}>Fuzz</h1>
          <p className="text-sm" style={{ color: '#B5A48A' }}>和自己好好待一会儿</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input placeholder="你想让我叫你什么？" value={nickname} maxLength={10}
            onChange={e => setNickname(e.target.value)}
            className="w-full px-4 py-3 outline-none transition-all"
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = '#F4B942'}
            onBlur={e => e.currentTarget.style.borderColor = '#E8DFC8'}
          />
          <input type="email" placeholder="你的邮箱" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 outline-none transition-all"
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = '#F4B942'}
            onBlur={e => e.currentTarget.style.borderColor = '#E8DFC8'}
          />
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="密码（至少8位）"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 outline-none transition-all pr-12"
              style={inputStyle}
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
            {loading ? '创建中...' : '创建账号'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: '#7A6A52' }}>
          已有账号？{' '}
          <Link href="/login" style={{ color: '#E8963A', fontWeight: 500 }}>去登录</Link>
        </p>
      </div>
    </div>
  )
}
