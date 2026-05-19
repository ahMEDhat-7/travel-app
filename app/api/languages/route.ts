import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const LANGUAGE_NAMES: Record<string, { name: string; nativeName: string }> = {
  en: { name: 'English', nativeName: 'EN' },
  ru: { name: 'Russian', nativeName: 'RU' },
  ar: { name: 'Arabic', nativeName: 'AR' },
  es: { name: 'Spanish', nativeName: 'ES' },
  fr: { name: 'French', nativeName: 'FR' },
  de: { name: 'German', nativeName: 'DE' },
  it: { name: 'Italian', nativeName: 'IT' },
  zh: { name: 'Chinese', nativeName: 'ZH' },
  ja: { name: 'Japanese', nativeName: 'JA' },
};

export async function GET() {
  try {
    const result = await db.tour.findMany({
      take: 100,
    });

    const langSet = new Set<string>();
    result.forEach(row => {
      if (row.translations && typeof row.translations === 'object') {
        Object.keys(row.translations).forEach(key => langSet.add(key));
      }
    });

    const languages = Array.from(langSet)
      .filter(code => LANGUAGE_NAMES[code])
      .map(code => ({
        code,
        name: LANGUAGE_NAMES[code].name,
        nativeName: LANGUAGE_NAMES[code].nativeName,
      }));

    if (languages.length === 0) {
      languages.push({ code: 'en', name: 'English', nativeName: 'EN' });
      languages.push({ code: 'ru', name: 'Russian', nativeName: 'RU' });
    }

    return NextResponse.json({ success: true, languages });
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch languages', languages: [{ code: 'en', name: 'English', nativeName: 'EN' }] },
      { status: 200 }
    );
  }
}