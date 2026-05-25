import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    if (process.env.ALLOW_SETUP !== 'true') {
      return NextResponse.json({
        success: false,
        error: 'Setup is disabled. Set ALLOW_SETUP=true to enable.'
      }, { status: 403 });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    if (!ADMIN_EMAIL) {
      return NextResponse.json({
        success: false,
        error: 'ADMIN_EMAIL environment variable is required'
      }, { status: 400 });
    }

    let admin = await db.user.findUnique({ where: { email: ADMIN_EMAIL } });
    
    if (!admin) {
      admin = await db.user.create({
        data: {
          email: ADMIN_EMAIL,
          name: 'Admin',
          role: 'ADMIN',
        },
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin account ready',
      admin: { email: admin.email, name: admin.name, role: admin.role }
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}