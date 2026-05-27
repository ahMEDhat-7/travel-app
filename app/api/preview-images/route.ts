import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tours = await db.tour.findMany({
      where: { isActive: true },
      select: { images: true },
    });

    const previewImages: string[] = [];
    for (const tour of tours) {
      const valid = (tour.images as string[]).filter(
        (img) => typeof img === 'string' && img.startsWith('http')
      );
      previewImages.push(...valid.slice(0, 2));
      if (previewImages.length >= 10) break;
    }

    return NextResponse.json({ success: true, images: previewImages });
  } catch (error) {
    console.error('Failed to fetch preview images:', error);
    return NextResponse.json({ success: false, images: [] }, { status: 500 });
  }
}
