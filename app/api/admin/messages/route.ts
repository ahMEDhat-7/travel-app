import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    const userWhere: any = {};
    if (filter === 'unread') {
      userWhere.messages = { some: { isReadByAdmin: false } };
    }

    const users = await db.user.findMany({
      where: userWhere,
      select: {
        id: true,
        name: true,
        email: true,
        messages: {
          where: { replyToId: null },
          orderBy: { createdAt: 'desc' },
          include: {
            replies: {
              orderBy: { createdAt: 'asc' },
              include: {
                user: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    const userChats = users
      .map(user => ({
        userId: user.id,
        userName: user.name || user.email,
        userEmail: user.email,
        messages: user.messages,
        lastMessage: user.messages[0]?.createdAt,
        unreadCount: user.messages.reduce((count, msg) => {
          return count + (msg.isReadByAdmin ? 0 : 1) + msg.replies.filter((r: any) => !r.isReadByAdmin).length;
        }, 0),
      }))
      .filter(chat => chat.messages.length > 0)
      .sort((a, b) => {
        if (filter === 'unread') {
          return b.unreadCount - a.unreadCount;
        }
        return new Date(b.lastMessage).getTime() - new Date(a.lastMessage).getTime();
      });

    const totalUnread = userChats.reduce((sum, chat) => sum + chat.unreadCount, 0);

    return NextResponse.json({ success: true, data: userChats, unreadCount: totalUnread });
  } catch (error: any) {
    console.error('Error fetching admin messages:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId } = body;

    if (userId) {
      await db.message.updateMany({
        where: { 
          userId,
          isReadByAdmin: false,
        },
        data: { isReadByAdmin: true },
      });
    } else {
      await db.message.updateMany({
        where: { isReadByAdmin: false },
        data: { isReadByAdmin: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}