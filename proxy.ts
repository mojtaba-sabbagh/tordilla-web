// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The root layout cannot read `?lang`, so expose the requested locale as a
// header it can read to render <html dir/lang> correctly on the server.
export function proxy(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('lang') === 'en' ? 'en' : 'fa';
  const headers = new Headers(request.headers);
  headers.set('x-locale', locale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
