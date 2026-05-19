import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

const createMessageSchema = z.object({
  subject: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(5000),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const messages = await db.message.findMany({
      where: { 
        userId: session.user.id as string,
        replyToId: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const input = createMessageSchema.parse(body);

    const message = await db.message.create({
      data: {
        userId: session.user.id as string,
        subject: input.subject,
        content: input.content,
        senderType: 'USER',
      },
    });

    await db.notification.create({
      data: {
        userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        type: 'NEW_MESSAGE',
        title: 'New Message',
        message: `New message from ${session.user.name || session.user.email}`,
        data: { messageId: message.id },
      },
    });

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await db.message.updateMany({
      where: { 
        userId: session.user.id as string,
        senderType: 'ADMIN',
        isRead: false,
      },
      data: { isRead: true },
    });

    await db.message.updateMany({
      where: { 
        userId: session.user.id as string,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}