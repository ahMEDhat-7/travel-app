export type CurrencyCode = 'USD' | 'EGP' | 'RUB';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number;
}

export const currencies: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  EGP: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', rate: 50 },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', rate: 92 },
};

export function convertPrice(priceUSD: number, targetCurrency: CurrencyCode): number {
  const currency = currencies[targetCurrency];
  return Math.round(priceUSD * currency.rate * 100) / 100;
}

export function formatPrice(priceUSD: number, currencyCode: CurrencyCode, locale: string = 'en'): string {
  const converted = convertPrice(priceUSD, currencyCode);
  const currency = currencies[currencyCode];
  
  const localeMap: Record<string, string> = {
    en: 'en-US',
    ru: 'ru-RU',
  };
  
  const formattedLocale = localeMap[locale] || 'en-US';
  
  return new Intl.NumberFormat(formattedLocale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(converted);
}

export function getCurrencySymbol(currencyCode: CurrencyCode): string {
  return currencies[currencyCode]?.symbol || '$';
}

export function getDefaultCurrency(): CurrencyCode {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('currency');
    if (saved && currencies[saved as CurrencyCode]) {
      return saved as CurrencyCode;
    }
    
    const browserLang = navigator.language;
    if (browserLang.startsWith('ru')) return 'RUB';
  }
  return 'USD';
}