import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const existingUsers = await db.user.findMany({ take: 1 });
    
    if (existingUsers.length === 0) {
      await db.user.createMany({
        data: [
          {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            email: 'admin@sharmcloudtours.com',
            name: 'Admin',
            role: 'ADMIN',
          },
          {
            id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
            email: 'test@example.com',
            name: 'Test User',
            role: 'USER',
          },
        ],
      }).catch(() => {});
      
      return NextResponse.json({ 
        success: true, 
        message: 'Database initialized with users',
        admin: 'admin@sharmcloudtours.com'
      });
    }
    
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      users: allUsers 
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}