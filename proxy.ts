import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'kg', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default async function middleware(request: NextRequest) {
  let response = intlMiddleware(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/');
  const locale = ['en', 'kg', 'ru'].includes(segments[1]) ? segments[1] : 'en';

  const isDashboardRoute = pathname.includes('/dashboard') || pathname.includes('/vision') || pathname.includes('/settings');
  const isAuthRoute = pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/reset-password');

  if (!user && isDashboardRoute) {
    const url = new URL(`/${locale}/login`, request.url);
    const redirectResponse = NextResponse.redirect(url);
    
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  const hasResetCode = request.nextUrl.searchParams.has('code');
  
  if (user && isAuthRoute && !hasResetCode) {
    const url = new URL(`/${locale}/dashboard`, request.url);
    const redirectResponse = NextResponse.redirect(url);
    
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-touch-icon.png|.*\\..*).*)']
};