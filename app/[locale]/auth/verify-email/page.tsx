'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { use } from 'react';
import { signIn } from 'next-auth/react';

interface VerifyEmailPageProps {
  params: Promise<{ locale: string }>;
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const { locale } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const email = searchParams.get('email') || '';
  
  const t: Record<string, string> = locale === 'ru' ? {
    title: 'Verify Your Email',
    subtitle: 'Enter the 6-digit code sent to your email',
    codeLabel: 'Verification Code',
    verifyButton: 'Verify Email',
    verifying: 'Verifying...',
    resendButton: 'Resend Code',
    resending: 'Sending...',
    backToLogin: 'Back to Sign In',
    successMessage: 'Email verified! Redirecting...',
    emailSent: 'A new code has been sent to your email',
  } : {
    title: 'Verify Your Email',
    subtitle: 'Enter the 6-digit code sent to your email',
    codeLabel: 'Verification Code',
    verifyButton: 'Verify Email',
    verifying: 'Verifying...',
    resendButton: 'Resend Code',
    resending: 'Sending...',
    backToLogin: 'Back to Sign In',
    successMessage: 'Email verified! Redirecting...',
    emailSent: 'A new code has been sent to your email',
  };

  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Verification failed');
        return;
      }

      setSuccess(true);
      
      const result = await signIn('credentials', {
        email,
        password: '',
        redirect: false,
      });

      setTimeout(() => {
        router.push(`/${locale}`);
      }, 1500);
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setError('');

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setError('');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        alert(t.emailSent);
      } else {
        setError(data.error || 'Failed to resend code');
      }
    } catch {
      setError('Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)] relative overflow-hidden py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md px-4 md:px-6 py-12 relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-[var(--theme-text-secondary)] mt-2">{t.subtitle}</p>
          {email && (
            <p className="text-amber-400 text-sm mt-1">{email}</p>
          )}
        </div>

        <div className="bg-[var(--theme-card)] backdrop-blur-xl rounded-2xl p-8 border border-[var(--theme-border)] shadow-2xl">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--theme-text)] mb-2">{t.successMessage}</h3>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-3">
                  {t.codeLabel}
                </label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50"
              >
                {isLoading ? t.verifying : t.verifyButton}
              </button>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full py-2 text-amber-400 hover:text-amber-300 text-sm font-medium disabled:opacity-50"
                >
                  {isResending ? t.resending : t.resendButton}
                </button>
                <a
                  href={`/${locale}/auth/signin`}
                  className="w-full py-2 text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] text-sm text-center"
                >
                  {t.backToLogin}
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
