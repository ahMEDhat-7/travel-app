'use client';

import { useCurrency } from '@/contexts/CurrencyContext';
import { CurrencyCode } from '@/lib/currency';
import Dropdown from '@/components/ui/Dropdown';

const currencyOptions = [
  { value: 'USD', label: '$ USD' },
  { value: 'EGP', label: 'E£ EGP' },
  { value: 'RUB', label: '₽ RUB' },
];

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Dropdown
      options={currencyOptions}
      value={currency}
      onChange={(value) => setCurrency(value as CurrencyCode)}
      className="min-w-[90px]"
    />
  );
}