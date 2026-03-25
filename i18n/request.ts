import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'kg', 'ru'];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as any)) {
    return {
      locale: 'en',
      messages: (await import(`../messages/en.json`)).default
    };
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});