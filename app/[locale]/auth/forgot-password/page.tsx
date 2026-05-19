'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { use } from 'react';

interface ForgotPasswordPageProps {
  params: Promise<{ locale: string }>;
}

export default function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { locale } = use(params);
  const router = useRouter();
  
  const translations: Record<string, Record<string, string>> = {
    en: {
      title: 'Forgot Password',
      subtitle: 'Enter your email to receive a reset link',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      submitButton: 'Send Reset Link',
      submitLoading: 'Sending...',
      backToLogin: 'Remember your password?',
      backToLoginLink: 'Sign in',
      successTitle: 'Check Your Email',
      successMessage: 'If an account exists with this email, you will receive a password reset link shortly.',
      error: 'Failed to send reset link. Please try again.',
    },
    ru: {
      title: 'Забыли пароль',
      subtitle: 'Введите email для получения ссылки на сброс',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      submitButton: 'Отправить ссылку',
      submitLoading: 'Отправка...',
      backToLogin: 'Помните пароль?',
      backToLoginLink: 'Войти',
      successTitle: 'Проверьте email',
      successMessage: 'Если аккаунт с этим email существует, вы получите ссылку для сброса пароля.',
      error: 'Не удалось отправить ссылку. Попробуйте снова.',
    },
  };
  
  const t = translations[locale] || translations.en;
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || t.error);
        return;
      }

      setIsSuccess(true);
    } catch {
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)] relative overflow-hidden py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-md px-4 md:px-6 py-12 relative text-center">
          <div className="bg-[var(--theme-card)] backdrop-blur-xl rounded-2xl p-8 border border-[var(--theme-border)] shadow-2xl">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--theme-text)] mb-2">{t.successTitle}</h1>
            <p className="text-[var(--theme-text-secondary)] mb-6">{t.successMessage}</p>
            <button
              onClick={() => router.push(`/${locale}/auth/signin`)}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              {t.backToLoginLink}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        </div>

        <div className="bg-[var(--theme-card)] backdrop-blur-xl rounded-2xl p-8 border border-[var(--theme-border)] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
                {t.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder={t.emailPlaceholder}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50"
            >
              {isLoading ? t.submitLoading : t.submitButton}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--theme-text-secondary)]">
            {t.backToLogin}{' '}
            <a href={`/${locale}/auth/signin`} className="text-amber-400 hover:text-amber-300 font-medium">
              {t.backToLoginLink}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}