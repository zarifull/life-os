import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. Алгачкы жоопту түзүү
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  
  const segments = pathname.split('/')
  const locale = segments[1] || 'en'

  const isDashboardPage = pathname.includes('/dashboard') || pathname.includes('/settings')
  const isAuthPage = pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/reset-password')

  if (!user && isDashboardPage) {
    const url = new URL(`/${locale}/login`, request.url)
    return NextResponse.redirect(url)
  }
  if (user && isAuthPage) {
    if (!pathname.includes('/reset-password')) {
      const url = new URL(`/${locale}/dashboard`, request.url)
      return NextResponse.redirect(url)
    }
  }

  return response
}