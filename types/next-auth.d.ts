import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'USER' | 'ADMIN';
      phone: string | null;
    } & DefaultSession['user'];
  }

  interface JWT {
    id?: string;
    role?: 'USER' | 'ADMIN';
    phone?: string | null;
  }
}