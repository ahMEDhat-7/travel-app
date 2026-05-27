import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cloudinary } from '@/lib/cloudinary';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== 'ADMIN') {
    return false;
  }
  return true;
}

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm'];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];
const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const VIDEO_MAX_SIZE = 50 * 1024 * 1024;

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

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type. Only JPG, PNG, WebP, GIF images and MP4, WebM videos are allowed.' }, { status: 400 });
    }

    const isVideo = VIDEO_TYPES.includes(file.type);
    const maxSize = isVideo ? VIDEO_MAX_SIZE : IMAGE_MAX_SIZE;
    if (file.size > maxSize) {
      const sizeLabel = isVideo ? '50MB' : '5MB';
      return NextResponse.json({ success: false, error: `File too large. Maximum size is ${sizeLabel}.` }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let result: { secure_url: string; public_id: string };

    if (isVideo) {
      const uploadFn = cloudinary.uploader.upload_chunked_stream as unknown as (
        options: Record<string, unknown>,
        callback: (error: unknown, result: unknown) => void
      ) => { end: (buffer: Buffer) => void };

      result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const uploadStream = uploadFn(
          {
            folder: 'tours-videos',
            resource_type: 'video',
            chunk_size: 5 * 1024 * 1024,
            eager: [{ format: 'mp4', quality: 'auto' }],
            eager_async: true,
          },
          (error: unknown, chunkedResult: unknown) => {
            if (error) reject(error);
            else resolve(chunkedResult as { secure_url: string; public_id: string });
          }
        );
        uploadStream.end(buffer);
      });
    } else {
      result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'tours-images',
            resource_type: 'image',
          },
          (error: unknown, imageResult: unknown) => {
            if (error) reject(error);
            else resolve(imageResult as { secure_url: string; public_id: string });
          }
        );
        uploadStream.end(buffer);
      });
    }

    return NextResponse.json({
      success: true,
      path: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
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
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json({ success: false, error: 'No publicId provided' }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to delete file' }, { status: 500 });
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete file' }, { status: 500 });
  }
}
