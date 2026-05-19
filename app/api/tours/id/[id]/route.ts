import { NextRequest, NextResponse } from 'next/server';
import * as tourService from '@/services/tour.service';
import type { Locale } from '@/lib/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get('locale') || 'en') as Locale;
    
    const tour = await tourService.getTourById(id, locale);

    if (!tour) {
      return NextResponse.json(
        { success: false, error: 'Tour not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: tour });
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tour' },
      { status: 500 }
    );
  }
}