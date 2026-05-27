export function getVideoUrl(url: string): string {
  if (!url.includes('res.cloudinary.com')) return url;

  let fixed = url.replace('/image/upload/', '/video/upload/');

  if (fixed.includes('/video/upload/')) {
    const parts = fixed.split('/video/upload/');
    if (parts.length === 2 && !parts[1].startsWith('q_auto,f_mp4/')) {
      fixed = `${parts[0]}/video/upload/q_auto,f_mp4/${parts[1]}`;
    }
  }

  return fixed;
}
