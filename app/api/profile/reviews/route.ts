import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userReviews = await db.review.findMany({
      where: { userId: session.user.id as string },
      orderBy: { createdAt: 'desc' },
      include: {
        tour: {
          select: {
            title: true,
            images: true,
          },
        },
      },
    });

    const reviewsWithTours = userReviews.map((review) => ({
      ...review,
      tourTitle: review.tour?.title || 'Unknown Tour',
      tourImage: (review.tour?.images as string[])?.[0] || null,
    }));

    return NextResponse.json({ success: true, data: reviewsWithTours });
  } catch (error) {
    console.error('Profile reviews GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}