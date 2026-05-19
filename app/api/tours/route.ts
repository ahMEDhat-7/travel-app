import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import * as tourService from '@/services/tour.service';
import * as tourRepo from '@/repositories/tour.repository';
import type { Locale } from '@/lib/constants';

const updateTourSchema = z.object({
  id: z.string().uuid(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      category: searchParams.get('category') || undefined,
      location: searchParams.get('location') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      duration: searchParams.get('duration') || undefined,
      search: searchParams.get('search') || undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
    };

    const sort = {
      field: searchParams.get('sort') as 'price' | 'rating' | 'popularity' | undefined,
      order: searchParams.get('order') as 'asc' | 'desc' | undefined,
    };

    const locale = (searchParams.get('locale') || 'en') as Locale;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const tours = await tourService.listTours(filters, sort, locale, limit, offset);

    return NextResponse.json({ success: true, data: tours });
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const input = updateTourSchema.parse(body);

    const updated = await tourRepo.updateTour(input.id, {
      isActive: input.isActive,
      isFeatured: input.isFeatured,
      isBestseller: input.isBestseller,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tour' },
      { status: 400 }
    );
  }
}