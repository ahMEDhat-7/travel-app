'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { use } from 'react';

interface ResetPasswordPageProps {
  params: Promise<{ locale: string }>;
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { locale } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const translations: Record<string, Record<string, string>> = {
    en: {
      title: 'Reset Password',
      subtitle: 'Create a new password for your account',
      passwordLabel: 'New Password',
      passwordPlaceholder: '••••••••',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: '••••••••',
      submitButton: 'Reset Password',
      submitLoading: 'Resetting...',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 8 characters',
      successTitle: 'Password Reset',
      successMessage: 'Your password has been reset successfully. You can now sign in with your new password.',
      signInLink: 'Sign in',
      invalidToken: 'Invalid or expired reset token',
    },
    ru: {
      title: 'Сброс пароля',
      subtitle: 'Создайте новый пароль для вашего аккаунта',
      passwordLabel: 'Новый пароль',
      passwordPlaceholder: '••••••••••',
      confirmPasswordLabel: 'Подтвердите пароль',
      confirmPasswordPlaceholder: '••••••••••',
      submitButton: 'Сбросить пароль',
      submitLoading: 'Сброс...',
      passwordMismatch: 'Пароли не совпадают',
      passwordTooShort: 'Пароль должен быть не менее 8 символов',
      successTitle: 'Пароль сброшен',
      successMessage: 'Ваш пароль был успешно сброшен. Теперь вы можете войти с новым паролем.',
      signInLink: 'Войти',
      invalidToken: 'Неверный или истекший токен сброса',
    },
  };
  
  const t = translations[locale] || translations.en;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    if (password.length < 8) {
      setError(t.passwordTooShort);
      return;
    }

    if (!token) {
      setIsValidToken(false);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Failed to reset password');
        return;
      }

      setIsSuccess(true);
    } catch {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)] relative overflow-hidden py-24">
        <div className="w-full max-w-md px-4 md:px-6 py-12 relative">
          <div className="bg-[var(--theme-card)] backdrop-blur-xl rounded-2xl p-8 border border-red-500/50 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--theme-text)] mb-2">{t.invalidToken}</h1>
            <button
              onClick={() => router.push(`/${locale}/auth/forgot-password`)}
              className="text-amber-400 hover:text-amber-300 font-medium mt-4 inline-block"
            >
              Request new reset link
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)] relative overflow-hidden py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
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
              className="py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/30"
            >
              {t.signInLink}
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
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
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder={t.passwordPlaceholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)]"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
                {t.confirmPasswordLabel}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder={t.confirmPasswordPlaceholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)]"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50"
            >
              {isLoading ? t.submitLoading : t.submitButton}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}