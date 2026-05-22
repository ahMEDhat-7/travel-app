import { NextResponse } from 'next/server';

const CDN_API = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
const ER_API = 'https://open.er-api.com/v6/latest/USD';

const FETCH_TIMEOUT = 5000;

const FALLBACK_RATES = {
  USD: 1,
  EGP: Number(process.env.CURRENCY_EGP_RATE) || 48.5,
  RUB: Number(process.env.CURRENCY_RUB_RATE) || 91.5,
};

let cachedRates: typeof FALLBACK_RATES | null = null;
let cacheTimestamp = 0;
let lastSource = '';
const CACHE_DURATION = 60 * 60 * 1000;

function fetchWithTimeout(url: string, timeout = FETCH_TIMEOUT) {
  return fetch(url, { signal: AbortSignal.timeout(timeout) });
}

async function tryCdnApi(): Promise<{ rates: typeof FALLBACK_RATES; source: string } | null> {
  try {
    const res = await fetchWithTimeout(CDN_API);
    if (!res.ok) return null;
    const data = await res.json();
    const egp = data?.usd?.egp;
    const rub = data?.usd?.rub;
    if (!egp || !rub) return null;
    return {
      rates: { USD: 1, EGP: Math.round(egp * 100) / 100, RUB: Math.round(rub * 100) / 100 },
      source: 'cdn',
    };
  } catch {
    return null;
  }
}

async function tryErApi(): Promise<{ rates: typeof FALLBACK_RATES; source: string } | null> {
  try {
    const res = await fetchWithTimeout(ER_API);
    if (!res.ok) return null;
    const data = await res.json();
    const egp = data?.rates?.EGP;
    const rub = data?.rates?.RUB;
    if (!egp || !rub) return null;
    return {
      rates: { USD: 1, EGP: Math.round(egp * 100) / 100, RUB: Math.round(rub * 100) / 100 },
      source: 'er-api',
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const now = Date.now();

  if (cachedRates && now - cacheTimestamp < CACHE_DURATION) {
    return NextResponse.json({
      success: true,
      source: `cache (${lastSource})`,
      rates: cachedRates,
      timestamp: now,
    });
  }

  const result = (await tryCdnApi()) || (await tryErApi());

  if (result) {
    cachedRates = result.rates;
    cacheTimestamp = now;
    lastSource = result.source;
    return NextResponse.json({
      success: true,
      source: result.source,
      rates: result.rates,
      timestamp: now,
    });
  }

  console.warn('Currency API: all sources failed, using env/default rates');
  return NextResponse.json({
    success: true,
    source: 'fallback',
    rates: FALLBACK_RATES,
    timestamp: now,
  });
}
