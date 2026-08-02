import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateVerificationCode, getTokenExpiry } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/email';

const changeEmailSchema = z.object({
  newEmail: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const input = changeEmailSchema.parse(body);

    if (input.newEmail === session.user.email) {
      return NextResponse.json(
        { success: false, error: 'New email must be different from current email' },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email: input.newEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const verificationCode = generateVerificationCode();
    const verificationTokenExpiry = getTokenExpiry(15);

    await db.user.update({
      where: { id: currentUser.id },
      data: {
        email: input.newEmail,
        emailVerified: false,
        verificationToken: verificationCode,
        verificationTokenExpiry,
      },
    });

    await sendVerificationEmail({
      to: input.newEmail,
      verificationCode,
      userName: currentUser.name,
    });

    return NextResponse.json({
      success: true,
      message: 'Email changed. Please verify your new email address.',
    });
  } catch (error: any) {
    console.error('Change email error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to change email' },
      { status: 400 }
    );
  }
}
