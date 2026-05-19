import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messages = locale === 'en' 
    ? (await import('@/lib/i18n/en.json')).default
    : (await import('@/lib/i18n/ru.json')).default;

  return {
    locale,
    messages,
  };
});