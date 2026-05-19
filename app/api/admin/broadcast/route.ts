import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { NotificationType } from '@prisma/client';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    return false;
  }
  return true;
}

const broadcastSchema = z.object({
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = broadcastSchema.parse(body);

    const users = await db.user.findMany({
      where: { role: 'USER' },
      select: { id: true },
    });

    const notifications = users.map(user => ({
      userId: user.id,
      type: 'BROADCAST' as NotificationType,
      title: input.title,
      message: input.message,
      data: JSON.stringify({ broadcast: true }),
    }));

    await db.notification.createMany({
      data: notifications,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Broadcast sent to ${users.length} users`,
      recipientCount: users.length 
    });
  } catch (error: any) {
    console.error('Error sending broadcast:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}