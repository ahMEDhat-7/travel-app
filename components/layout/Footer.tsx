import Link from 'next/link';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  return (
    <footer className="relative bg-[#0a0a0f] border-t border-white/10">
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
                Traveloo
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              {locale === 'ru' ? 'Откройте магию Египта с нашими тщательно подобранными турами.' : 'Discover the magic of Egypt with our carefully curated tours.'}
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">{locale === 'ru' ? 'Быстрые ссылки' : 'Quick Links'}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/tours`} className="text-slate-400 hover:text-amber-300 transition-colors">
                  {locale === 'ru' ? 'Туры' : 'Tours'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-slate-400 hover:text-amber-300 transition-colors">
                  {locale === 'ru' ? 'О нас' : 'About'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-slate-400 hover:text-amber-300 transition-colors">
                  {locale === 'ru' ? 'Контакты' : 'Contact'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-slate-400 hover:text-amber-300 transition-colors">
                  {locale === 'ru' ? 'Вопросы' : 'FAQ'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-slate-400 hover:text-amber-300 transition-colors">
                  {locale === 'ru' ? 'Условия' : 'Terms'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-slate-400 hover:text-amber-300 transition-colors">
                  {locale === 'ru' ? 'Конфиденциальность' : 'Privacy'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{locale === 'ru' ? 'Контакты' : 'Contact'}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>{locale === 'ru' ? 'Каир, Египет' : 'Cairo, Egypt'}</li>
              <li>info@traveloo.com</li>
              <li>+20 123 456 789</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{locale === 'ru' ? 'Подписаться' : 'Follow Us'}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-amber-500/20 hover:text-amber-400 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-amber-500/20 hover:text-amber-400 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-amber-500/20 hover:text-amber-400 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Traveloo. {locale === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">
              {locale === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy'}
            </a>
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">
              {locale === 'ru' ? 'Условия использования' : 'Terms of Service'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}