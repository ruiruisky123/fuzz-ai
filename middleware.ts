import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const publicRoutes = ['/login', '/register']
  if (publicRoutes.includes(pathname)) {
    if (user) return NextResponse.redirect(new URL('/home', request.url))
    return supabaseResponse
  }

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 用 cookie 标记已完成 onboarding，避免 DB 查询挂住
  const onboardingDone = request.cookies.get('onboarding_done')?.value === '1'

  if (pathname !== '/onboarding' && !onboardingDone) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    if (profile && !profile.onboarding_completed) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    // DB 查不到或已完成，设置 cookie 避免下次重复查
    if (profile?.onboarding_completed) {
      supabaseResponse.cookies.set('onboarding_done', '1', { maxAge: 60 * 60 * 24 * 30 })
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
