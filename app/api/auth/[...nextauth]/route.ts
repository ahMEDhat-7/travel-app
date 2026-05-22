import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };