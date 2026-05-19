import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(10).max(1000).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const review = await db.review.findFirst({
      where: { id, userId: session.user.id as string },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const input = updateReviewSchema.parse(body);

    if (!input.rating && !input.comment) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {};
    if (input.rating) updateData.rating = input.rating;
    if (input.comment) updateData.comment = input.comment;

    const updated = await db.review.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Profile review PUT error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update review' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const review = await db.review.findFirst({
      where: { id, userId: session.user.id as string },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found or access denied' },
        { status: 404 }
      );
    }

    const deleted = await db.review.delete({ where: { id } });

    return NextResponse.json({ success: true, data: deleted });
  } catch (error: any) {
    console.error('Profile review DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete review' },
      { status: 400 }
    );
  }
}