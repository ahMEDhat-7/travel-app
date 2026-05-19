import { routing } from '@/lib/i18n/routing';
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(en|ru)/:path*'],
};