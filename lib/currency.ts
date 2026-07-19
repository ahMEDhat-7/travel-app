export type CurrencyCode = 'USD' | 'EGP' | 'RUB';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number;
}

const FALLBACK_EGP = Number(process.env.CURRENCY_EGP_RATE) || 52.93;
const FALLBACK_RUB = Number(process.env.CURRENCY_RUB_RATE) || 71.12;

export const currencies: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  EGP: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', rate: FALLBACK_EGP },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', rate: FALLBACK_RUB },
};
