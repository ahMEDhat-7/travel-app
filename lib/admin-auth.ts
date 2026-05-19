import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }
  
  return session;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    throw new Error('ADMIN_REQUIRED');
  }
  
  return session;
}