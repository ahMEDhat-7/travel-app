'use client';

interface PriceBreakdownProps {
  adults: number;
  children?: number;
  adultPrice: number;
  childPrice?: number;
  currency?: string;
}

export default function PriceBreakdown({
  adults,
  children = 0,
  adultPrice,
  childPrice,
  currency = '$',
}: PriceBreakdownProps) {
  const adultTotal = adults * adultPrice;
  const childTotal = children ? (childPrice || adultPrice) * children : 0;
  const subtotal = adultTotal + childTotal;

  return (
    <div className="bg-[var(--theme-bg-tertiary)] rounded-xl p-4 space-y-3">
      <h4 className="font-semibold text-[var(--theme-text)]">
        Price Breakdown
      </h4>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-[var(--theme-text-secondary)]">
          <span>
            {adults} {adults === 1 ? 'Adult' : 'Adults'} × {currency}{adultPrice}
          </span>
          <span>{currency}{adultTotal.toFixed(2)}</span>
        </div>

        {children > 0 && (
          <div className="flex justify-between text-[var(--theme-text-secondary)]">
            <span>
              {children} {children === 1 ? 'Child' : 'Children'} × {currency}{childPrice || adultPrice}
            </span>
            <span>{currency}{childTotal.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t border-[var(--theme-border)] pt-2 mt-2">
          <div className="flex justify-between font-semibold text-[var(--theme-text)]">
            <span>Total</span>
            <span className="text-amber-500">{currency}{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {children > 0 && childPrice !== undefined && childPrice < adultPrice && (
        <p className="text-xs text-[var(--theme-text-muted)]">
          * Child price applies to ages 2-11
        </p>
      )}
    </div>
  );
}