import { createServerClient, type CookieOptions } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'kg', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default async function (request: NextRequest) {
  let response = intlMiddleware(request) || NextResponse.next();

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
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/');
  const locale = ['en', 'kg', 'ru'].includes(segments[1]) ? segments[1] : 'en';

  if (user && pathname.includes('/login')) {
    const url = new URL(`/${locale}/dashboard`, request.url);
    const redirectResponse = NextResponse.redirect(url);
    
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    
    return redirectResponse;
  }

  if (!user && pathname.includes('/dashboard')) {
    const url = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};