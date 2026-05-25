'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SocialIcon, { platformColor } from '@/components/SocialIcon';

interface SocialLink {
  platform: string;
  url: string;
  label?: string;
  order: number;
}

interface ContactData {
  email: string;
  phone: string;
  whatsapp: string;
  whatsappLink: string | null;
  address: string;
  socialLinks: SocialLink[];
}

interface FooterProps {
  locale: string;
}

const DEFAULT_CONTACT: ContactData = {
  email: 'support@sharmcloudtours.com',
  phone: '',
  whatsapp: '',
  whatsappLink: null,
  address: '',
  socialLinks: [],
};

export default function Footer({ locale }: FooterProps) {
  const [contact, setContact] = useState<ContactData>(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success && data.data) {
        const rawLinks = data.data.socialLinks || [];
        const links: SocialLink[] = Array.isArray(rawLinks)
          ? rawLinks.map((link: SocialLink, idx: number) => ({ ...link, order: link.order ?? idx }))
          : [];
        setContact({
          email: data.data.email || DEFAULT_CONTACT.email,
          phone: data.data.phone || '',
          whatsapp: data.data.whatsapp || '',
          whatsappLink: data.data.whatsappLink || null,
          address: data.data.address || '',
          socialLinks: links,
        });
      }
    } catch (error) {
      console.error('Error fetching contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const address = contact.address || (locale === 'ru' ? 'Шарм-эль-Шейх, Синай, Египет' : 'Sharm El-Sheikh, Sinai, Egypt');

  return (
    <footer className="relative bg-gray-800 border-t border-white/10">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
Sharm Cloud Tours
              </span>
            </div>
            <p className="text-slate-300 text-sm">
              {locale === 'ru' ? 'Откройте магию Шарм-эль-Шейха с нашими тщательно подобранными турами.' : 'Discover the magic of Sharm El-Sheikh with our carefully curated tours.'}
            </p>
          </div>
          
          <div>
            <h2 className="text-white font-semibold mb-4 text-lg">{locale === 'ru' ? 'Быстрые ссылки' : 'Quick Links'}</h2>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/tours`} className="text-slate-300 hover:text-amber-300 transition-colors">
                  {locale === 'ru' ? 'Туры' : 'Tours'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-slate-300 hover:text-amber-300 transition-colors">
                  {locale === 'ru' ? 'О нас' : 'About'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-slate-300 hover:text-amber-300 transition-colors">
                  {locale === 'ru' ? 'Контакты' : 'Contact'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-slate-300 hover:text-amber-300 transition-colors">
                  {locale === 'ru' ? 'Вопросы' : 'FAQ'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-slate-300 hover:text-amber-300 transition-colors">
                  {locale === 'ru' ? 'Условия' : 'Terms'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-slate-300 hover:text-amber-300 transition-colors">
                  {locale === 'ru' ? 'Конфиденциальность' : 'Privacy'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold mb-4 text-lg">{locale === 'ru' ? 'Контакты' : 'Contact'}</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {contact.address && <li>{address}</li>}
              <li>{contact.email}</li>
              {contact.phone && <li>{contact.phone}</li>}
              {contact.whatsappLink && (
                <li>
                  <a 
                    href={contact.whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold mb-4 text-lg">{locale === 'ru' ? 'Подписаться' : 'Follow Us'}</h2>
            <div className="flex gap-4 flex-wrap">
              {contact.socialLinks
                .sort((a, b) => a.order - b.order)
                .map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                    aria-label={link.label || link.platform}
                    style={{ color: platformColor(link.platform) }}
                  >
                    <SocialIcon platform={link.platform} className="w-5 h-5" />
                  </a>
                ))}
              {contact.socialLinks.length === 0 && (
                <span className="text-slate-400 text-sm">
                  {locale === 'ru' ? 'Нет ссылок' : 'No links added'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-300 text-sm">
            © {new Date().getFullYear()} Sharm Cloud Tours. {locale === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}
          </p>
          <div className="flex gap-6 text-sm">
            <Link href={`/${locale}/privacy`} className="text-slate-300 hover:text-amber-400 transition-colors">
              {locale === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy'}
            </Link>
            <Link href={`/${locale}/terms`} className="text-slate-300 hover:text-amber-400 transition-colors">
              {locale === 'ru' ? 'Условия использования' : 'Terms of Service'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}