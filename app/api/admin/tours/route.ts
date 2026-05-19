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

const tourSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  shortDesc: z.string().min(1),
  description: z.string().min(1),
  highlights: z.array(z.string()),
  included: z.array(z.string()),
  notIncluded: z.array(z.string()),
  itinerary: z.array(z.object({
    day: z.number(),
    title: z.string(),
    description: z.string(),
  })).optional(),
  translations: z.record(z.string(), z.object({
    title: z.string(),
    shortDesc: z.string(),
    description: z.string(),
    highlights: z.array(z.string()).optional(),
    included: z.array(z.string()).optional(),
    notIncluded: z.array(z.string()).optional(),
    itinerary: z.array(z.object({
      day: z.number(),
      title: z.string(),
      description: z.string(),
    })).optional(),
  })),
  price: z.number().min(0),
  childPrice: z.number().optional(),
  discountPrice: z.number().optional(),
  duration: z.string().min(1),
  location: z.string().min(1),
  category: z.string().min(1),
  images: z.array(z.string()),
  maxCapacity: z.number().min(1),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  hasFreeCancellation: z.boolean().default(false),
});

const updateTourSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  shortDesc: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  highlights: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  notIncluded: z.array(z.string()).optional(),
  itinerary: z.array(z.object({
    day: z.number(),
    title: z.string(),
    description: z.string(),
  })).optional(),
  translations: z.record(z.string(), z.object({
    title: z.string(),
    shortDesc: z.string(),
    description: z.string(),
    highlights: z.array(z.string()).optional(),
    included: z.array(z.string()).optional(),
    notIncluded: z.array(z.string()).optional(),
    itinerary: z.array(z.object({
      day: z.number(),
      title: z.string(),
      description: z.string(),
    })).optional(),
  })).optional(),
  price: z.number().min(0).optional(),
  childPrice: z.number().optional(),
  discountPrice: z.number().optional(),
  duration: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  images: z.array(z.string()).optional(),
  maxCapacity: z.number().min(1).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  hasFreeCancellation: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (id) {
      const tour = await db.tour.findUnique({ where: { id } });
      if (!tour) {
        return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: tour });
    }

    if (slug) {
      const tour = await db.tour.findUnique({ where: { slug } });
      if (!tour) {
        return NextResponse.json({ success: false, error: 'Tour not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: tour });
    }

    const allTours = await db.tour.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: allTours });
  } catch (error: any) {
    console.error('Error fetching tours:', error);
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
    const input = tourSchema.parse(body);

    const tour = await db.tour.create({ data: input });

    return NextResponse.json({ success: true, data: tour }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating tour:', error);
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
    const input = updateTourSchema.parse(body);

    if (!input.id) {
      return NextResponse.json({ success: false, error: 'Tour ID is required' }, { status: 400 });
    }

    const { id, ...updateData } = input;

    const tour = await db.tour.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: tour });
  } catch (error: any) {
    console.error('Error updating tour:', error);
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
      return NextResponse.json({ success: false, error: 'Tour ID is required' }, { status: 400 });
    }

    const deleted = await db.tour.delete({ where: { id } });

    return NextResponse.json({ success: true, data: deleted });
  } catch (error: any) {
    console.error('Error deleting tour:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}