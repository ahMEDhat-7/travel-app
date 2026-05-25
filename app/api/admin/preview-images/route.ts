import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { readdir, writeFile, unlink } from 'fs/promises';
import { join } from 'path';

const PREVIEW_DIR = join(process.cwd(), 'public', 'images', 'previewer-images');
const PUBLIC_PATH = '/images/previewer-images';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    return false;
  }
  return true;
}

export async function GET() {
  try {
    const files = await readdir(PREVIEW_DIR);
    const images = files
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .sort((a, b) => {
        const aTs = parseInt(a.split('-')[0]);
        const bTs = parseInt(b.split('-')[0]);
        return (isNaN(aTs) ? 0 : aTs) - (isNaN(bTs) ? 0 : bTs);
      })
      .map((name) => ({
        name,
        path: `${PUBLIC_PATH}/${name}`,
      }));

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error('List preview images error:', error);
    return NextResponse.json({ success: false, error: 'Failed to list images' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.' }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${originalName}`;
    const filePath = join(PREVIEW_DIR, fileName);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      path: `${PUBLIC_PATH}/${fileName}`,
      fileName,
    });
  } catch (error) {
    console.error('Preview image upload error:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json({ success: false, error: 'No file name provided' }, { status: 400 });
    }

    const filePath = join(PREVIEW_DIR, fileName);

    try {
      await unlink(filePath);
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Preview image delete error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete file' }, { status: 500 });
  }
}
