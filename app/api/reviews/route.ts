import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

const createReviewSchema = z.object({
  tourId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    
    const reviews = await db.review.findMany({
      where: { status: 'APPROVED' },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        tour: { select: { title: true } },
      },
    });
    
    const reviewsWithDetails = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      userName: r.user?.name || 'Anonymous',
      tourTitle: r.tour?.title || 'Tour',
    }));
    
    return NextResponse.json({ success: true, data: reviewsWithDetails });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Please sign in to leave a review' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const input = createReviewSchema.parse(body);

    const review = await db.review.create({
      data: {
        userId: session.user.id,
        tourId: input.tourId,
        rating: input.rating,
        comment: input.comment,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    console.error('Review error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit review' },
      { status: 400 }
    );
  }
}