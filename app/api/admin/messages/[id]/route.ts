import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    return false;
  }
  return true;
}

const replySchema = z.object({
  content: z.string().min(1).max(5000),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const message = await db.message.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    if (!message.isReadByAdmin) {
      await db.message.update({
        where: { id },
        data: { isReadByAdmin: true },
      });
    }

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    console.error('Error fetching admin message:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const input = replySchema.parse(body);

    const originalMessage = await db.message.findUnique({
      where: { id },
      select: { userId: true, subject: true },
    });

    if (!originalMessage) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    const reply = await db.message.create({
      data: {
        userId: originalMessage.userId,
        subject: originalMessage.subject,
        content: input.content,
        senderType: 'ADMIN',
        replyToId: id,
      },
    });

    await db.message.update({
      where: { id },
      data: { isRead: false },
    });

    await db.notification.create({
      data: {
        userId: originalMessage.userId,
        type: 'MESSAGE_REPLY',
        title: 'New Reply',
        message: 'You have a new reply to your message',
        data: { messageId: reply.id },
      },
    });

    return NextResponse.json({ success: true, data: reply }, { status: 201 });
  } catch (error: any) {
    console.error('Error sending admin reply:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}