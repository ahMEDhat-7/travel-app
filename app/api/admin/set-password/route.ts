import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_SETUP_PASSWORD = process.env.ADMIN_SETUP_PASSWORD;

    if (!ADMIN_EMAIL || !ADMIN_SETUP_PASSWORD) {
      return NextResponse.json({
        success: false,
        error: 'ADMIN_EMAIL and ADMIN_SETUP_PASSWORD environment variables are required'
      }, { status: 400 });
    }

    let admin = await db.user.findUnique({ where: { email: ADMIN_EMAIL } });
    
    if (!admin) {
      admin = await db.user.create({
        data: { 
          email: ADMIN_EMAIL, 
          name: 'Admin', 
          role: 'ADMIN',
          password: ADMIN_SETUP_PASSWORD
        }
      });
    } else {
      admin = await db.user.update({
        where: { email: ADMIN_EMAIL },
        data: { 
          name: 'Admin', 
          role: 'ADMIN',
        }
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin account ready',
      email: ADMIN_EMAIL,
      role: admin.role
    });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}