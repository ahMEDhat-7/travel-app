import { db } from '@/lib/db';

const FALLBACK_RATES = {
  USD: 1,
  EGP: 48.5,
  RUB: 91.5,
};

interface ExchangeRates {
  USD: number;
  EGP: number;
  RUB: number;
  lastUpdated: Date;
}

let cachedRates: ExchangeRates | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000;

export async function getExchangeRates(): Promise<ExchangeRates> {
  const now = Date.now();
  
  if (cachedRates && now - cacheTimestamp < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=EGP,RUB', {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();

    cachedRates = {
      USD: 1,
      EGP: Math.round((data.rates?.EGP || FALLBACK_RATES.EGP) * 100) / 100,
      RUB: Math.round((data.rates?.RUB || FALLBACK_RATES.RUB) * 100) / 100,
      lastUpdated: new Date(),
    };
    cacheTimestamp = now;

    return cachedRates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    return {
      USD: 1,
      EGP: FALLBACK_RATES.EGP,
      RUB: FALLBACK_RATES.RUB,
      lastUpdated: new Date(),
    };
  }
}

export function getRatesFromCache(): ExchangeRates {
  return cachedRates || {
    USD: 1,
    EGP: FALLBACK_RATES.EGP,
    RUB: FALLBACK_RATES.RUB,
    lastUpdated: new Date(),
  };
}