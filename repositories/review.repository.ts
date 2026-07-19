import { db } from '@/lib/db';

export async function updateStatus(id: string, status: 'APPROVED' | 'REJECTED') {
  return db.review.update({
    where: { id },
    data: { status },
  });
}
