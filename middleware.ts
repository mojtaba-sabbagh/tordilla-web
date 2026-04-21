// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // We're using client-side auth, so no middleware protection
  return NextResponse.next();
}

export const config = {
  matcher: [],
};