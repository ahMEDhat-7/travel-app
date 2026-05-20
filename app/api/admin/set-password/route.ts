import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 32;
const TAG_LENGTH = 16;
const ITERATIONS = 100000;

function getKey(salt: Buffer): Buffer {
  const ENCRYPTION_KEY = process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development-only';
  return crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, ITERATIONS, 32, 'sha256');
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = getKey(salt);
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  
  return salt.toString('hex') + ':' + iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted.toString('hex');
}

export async function GET() {
  try {
    const ADMIN_EMAIL = 'admin@sharmcloudtours.com';
    const ADMIN_PASSWORD = 'Admin123!';
    const hashedPassword = hashPassword(ADMIN_PASSWORD);
    
    let admin = await db.user.findUnique({ where: { email: ADMIN_EMAIL } });
    
    if (!admin) {
      admin = await db.user.create({
        data: { 
          email: ADMIN_EMAIL, 
          name: 'Admin', 
          role: 'ADMIN',
          password: hashedPassword
        }
      });
    } else {
      admin = await db.user.update({
        where: { email: ADMIN_EMAIL },
        data: { 
          name: 'Admin', 
          role: 'ADMIN',
          password: hashedPassword
        }
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin account ready',
      credentials: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: admin.role
      }
    });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}