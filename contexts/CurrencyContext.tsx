'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyCode, currencies } from '@/lib/currency';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  convertPrice: (priceUSD: number) => number;
  formatPrice: (priceUSD: number, locale?: string) => string;
  rates: Record<string, number>;
  lastUpdated: Date | null;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}

function getCurrencyFromLocale(): CurrencyCode {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path.startsWith('/ru')) return 'RUB';
    if (path.startsWith('/en')) return 'USD';
    
    const saved = localStorage.getItem('currency');
    if (saved && currencies[saved as CurrencyCode]) {
      return saved as CurrencyCode;
    }
    
    const browserLang = navigator.language;
    if (browserLang.startsWith('ru')) return 'RUB';
  }
  return 'USD';
}

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [mounted, setMounted] = useState(false);
  const DEFAULT_RATES = { USD: 1, EGP: 52.93, RUB: 71.12 };

  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_RATES);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrencyState(getCurrencyFromLocale());
    fetchRates();
  }, []);

  const fetchRates = async () => {
    if (fetchFailed) return;
    
    try {
      const res = await fetch('/api/currency/rates', {
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json();
      if (data.success && data.rates) {
        setRates(data.rates);
        setFetchFailed(false);
        if (data.timestamp) {
          setLastUpdated(new Date(data.timestamp));
        }
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      setFetchFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', newCurrency);
    }
  };

  const convertPrice = (priceUSD: number): number => {
    const rate = rates[currency] || 1;
    return Math.round(priceUSD * rate * 100) / 100;
  };

  const formatPrice = (priceUSD: number, locale: string = 'en'): string => {
    const converted = convertPrice(priceUSD);
    
    const localeMap: Record<string, string> = {
      en: 'en-US',
      ru: 'ru-RU',
    };
    
    const formattedLocale = localeMap[locale] || 'en-US';
    
    return new Intl.NumberFormat(formattedLocale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice, rates, lastUpdated, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}