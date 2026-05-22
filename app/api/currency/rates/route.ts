import { NextResponse } from 'next/server';

const API_URL = 'https://api.frankfurter.app/latest?from=USD&to=EGP,RUB';

interface ExchangeRates {
  USD: number;
  EGP: number;
  RUB: number;
}

const FALLBACK_RATES: ExchangeRates = {
  USD: 1,
  EGP: 48.5,
  RUB: 91.5,
};

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(API_URL, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    const rates: ExchangeRates = {
      USD: 1,
      EGP: Math.round((data.rates?.EGP || FALLBACK_RATES.EGP) * 100) / 100,
      RUB: Math.round((data.rates?.RUB || FALLBACK_RATES.RUB) * 100) / 100,
    };

    return NextResponse.json({
      success: true,
      source: 'api',
      rates,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Currency API error:', error);

    return NextResponse.json({
      success: true,
      source: 'fallback',
      rates: FALLBACK_RATES,
      timestamp: Date.now(),
    });
  }
}