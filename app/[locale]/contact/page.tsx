'use client';

import { useState } from 'react';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default function ContactPage({ params }: ContactPageProps) {
  const { locale } = require('react').use(params);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const translations: Record<string, Record<string, string>> = {
    en: {
      title: 'Get in Touch',
      subtitle: "Have questions about our tours? We'd love to hear from you!",
      infoTitle: 'Contact Info',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      hours: 'Hours',
      hoursValue: 'Mon-Fri: 9AM - 6PM',
      formTitle: 'Send us a Message',
      nameLabel: 'Name',
      namePlaceholder: 'John Doe',
      emailLabel: 'Email',
      emailPlaceholder: 'john@example.com',
      messageLabel: 'Message',
      messagePlaceholder: 'Your message...',
      submitButton: 'Send Message',
      successTitle: 'Message Sent!',
      successText: "We'll get back to you soon.",
    },
    ru: {
      title: 'Связаться с нами',
      subtitle: 'Есть вопросы о турах? Будем рады услышать вас!',
      infoTitle: 'Контактная информация',
      email: 'Email',
      phone: 'Телефон',
      address: 'Адрес',
      hours: 'Время работы',
      hoursValue: 'Пн-Пт: 9:00 - 18:00',
      formTitle: 'Написать нам',
      nameLabel: 'Имя',
      namePlaceholder: 'Иван Иванов',
      emailLabel: 'Email',
      emailPlaceholder: 'ivan@example.com',
      messageLabel: 'Сообщение',
      messagePlaceholder: 'Ваше сообщение...',
      submitButton: 'Отправить сообщение',
      successTitle: 'Сообщение отправлено!',
      successText: 'Мы свяжемся с вами в ближайшее время.',
    },
  };

  const t = translations[locale] || translations.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg)] flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-2">{t.successTitle}</h2>
          <p className="text-[var(--theme-text-secondary)]">{t.successText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-24 md:py-32 relative">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-4">
            {t.title}
          </h1>
          <p className="text-[var(--theme-text-secondary)] text-lg">
            {t.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[var(--theme-card)] backdrop-blur-lg rounded-2xl p-8 border border-[var(--theme-border)]">
            <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-6">{t.infoTitle}</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[var(--theme-text-secondary)] text-sm">{t.email}</p>
                  <p className="text-amber-300 font-medium">info@traveloo.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[var(--theme-text-secondary)] text-sm">{t.phone}</p>
                  <p className="text-amber-300 font-medium">+20 123 456 789</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[var(--theme-text-secondary)] text-sm">{t.address}</p>
                  <p className="text-amber-300 font-medium">Cairo, Egypt</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[var(--theme-text-secondary)] text-sm">{t.hours}</p>
                  <p className="text-amber-300 font-medium">{t.hoursValue}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--theme-card)] backdrop-blur-lg rounded-2xl p-8 border border-[var(--theme-border)]">
            <h2 className="text-2xl font-bold text-[var(--theme-text)] mb-6">{t.formTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">{t.nameLabel}</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder={t.namePlaceholder}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">{t.emailLabel}</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder={t.emailPlaceholder}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">{t.messageLabel}</label>
                <textarea 
                  rows={4} 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  placeholder={t.messagePlaceholder}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/30"
              >
                {t.submitButton}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}