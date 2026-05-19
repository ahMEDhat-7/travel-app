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

const createReviewSchema = z.object({
  tourId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
});

const updateReviewSchema = z.object({
  id: z.string().uuid(),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(10).max(1000).optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  adminReply: z.string().max(1000).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    if (id) {
      const review = await db.review.findUnique({
        where: { id },
        include: {
          tour: { select: { title: true } },
          user: { select: { email: true, name: true } },
        },
      });

      if (!review) {
        return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          ...review,
          tourTitle: review.tour?.title || 'Unknown',
          userEmail: review.user?.email || 'Unknown',
          userName: review.user?.name || 'Anonymous',
        },
      });
    }

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const reviews = await db.review.findMany({
      where,
      include: {
        tour: { select: { title: true } },
        user: { select: { email: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const reviewsWithDetails = reviews.map((review) => ({
      ...review,
      tourTitle: review.tour?.title || 'Unknown Tour',
      userEmail: review.user?.email || 'Unknown',
      userName: review.user?.name || 'Anonymous',
    }));

    return NextResponse.json({ success: true, data: reviewsWithDetails });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = createReviewSchema.parse(body);

    const review = await db.review.create({
      data: {
        tourId: input.tourId,
        rating: input.rating,
        comment: input.comment,
        status: input.status,
        userId: input.userId || null,
      },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = updateReviewSchema.parse(body);

    if (!input.id) {
      return NextResponse.json({ success: false, error: 'Review ID is required' }, { status: 400 });
    }

    const { id, ...updateData } = input;

    const review = await db.review.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Review ID is required' }, { status: 400 });
    }

    const deleted = await db.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: deleted });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}