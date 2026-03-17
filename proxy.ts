import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'kg', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const config = {
  // Бул жер маанилүү: статикалык файлдарды өткөрүп жиберип, калганын тилге багыттайт
  matcher: ['/((?!api|_next|.*\\..*).*)']
};