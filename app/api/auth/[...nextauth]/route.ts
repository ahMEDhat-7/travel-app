import { NextRequest } from 'next/server';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth';

const nextAuthHandler = NextAuth(authOptions);

async function handler(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';
  const identifier = getRateLimitIdentifier(ip, '/api/auth/callback');

  const result = checkRateLimit(identifier, { windowMs: 60000, maxRequests: 10 });

  if (!result.allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resolvedParams = await context.params;

  const rawBody = request.headers.get('content-type')?.includes('application/x-www-form-urlencoded')
    ? await request.text()
    : undefined;

  let parsedBody: any = undefined;
  if (rawBody) {
    parsedBody = Object.fromEntries(new URLSearchParams(rawBody));
  } else if (request.method === 'POST') {
    try {
      parsedBody = await request.json();
    } catch {}
  }

  const headers: Record<string, string> = {};
  let responseStatus = 200;
  let responseBody = '';

  const cookieHeader = request.headers.get('cookie') || '';
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach(c => {
    const [key, ...val] = c.trim().split('=');
    if (key) cookies[key.trim()] = val.join('=');
  });

  const nodeReq = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    query: { nextauth: resolvedParams.nextauth },
    cookies,
    body: parsedBody,
  };

  const nodeRes = {
    getHeader(name: string) { return headers[name.toLowerCase()]; },
    setHeader(name: string, value: string | string[]) { headers[name.toLowerCase()] = Array.isArray(value) ? value.join(', ') : value; },
    removeHeader(name: string) { delete headers[name.toLowerCase()]; },
    get statusCode() { return responseStatus; },
    set statusCode(code: number) { responseStatus = code; },
    status(code: number) { responseStatus = code; return this; },
    end(body?: string) { if (body) responseBody = body; },
    write(chunk: any) { responseBody += typeof chunk === 'string' ? chunk : JSON.stringify(chunk); },
    redirect(_url: string) {},
    send(body: any) { responseBody = typeof body === 'string' ? body : JSON.stringify(body); },
    json(body: any) { responseBody = JSON.stringify(body); headers['content-type'] = 'application/json'; },
  };

  await nextAuthHandler(nodeReq as any, nodeRes as any);

  const contentType = headers['content-type'] || 'text/html';

  const responseHeaders = new Headers();
  for (const [key, value] of Object.entries(headers)) {
    responseHeaders.set(key, value);
  }

  return new Response(responseBody, { status: responseStatus, headers: responseHeaders });
}

export { handler as GET, handler as POST };
