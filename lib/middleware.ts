import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )


  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  const segments = pathname.split('/')
  const locale = segments[1] || 'en'

  const isDashboardRoute = pathname.includes('/dashboard') || pathname.includes('/vision') || pathname.includes('/settings')
  const isApiRoute = pathname.startsWith('/api') && !pathname.includes('/api/pin') 
  const isAuthRoute = pathname.includes('/login') || pathname.includes('/register')

  if (!user && (isDashboardRoute || isApiRoute)) {
    if (isApiRoute) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  if (user && (isDashboardRoute || isApiRoute)) {
    const isPinVerified = request.cookies.get('life_os_pin_verified')?.value === 'true'

    if (!isPinVerified && isApiRoute) {
       return NextResponse.json({ error: 'PIN Required' }, { status: 403 })
    }
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  return response
}