import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const admin = await db.user.findFirst({
      where: { role: 'ADMIN' },
      select: {
        email: true,
        phone: true,
        whatsapp: true,
        address: true,
        contactEmail: true,
        socialLinks: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      );
    }

    const whatsappLink = admin.whatsapp 
      ? `https://wa.me/${admin.whatsapp.replace(/\D/g, '')}`
      : null;

    return NextResponse.json({
      success: true,
      data: {
        email: admin.contactEmail || admin.email,
        phone: admin.phone,
        whatsapp: admin.whatsapp,
        whatsappLink,
        address: admin.address,
        contactEmail: admin.contactEmail || null,
        socialLinks: admin.socialLinks || [],
      },
    });
  } catch (error) {
    console.error('Contact GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}