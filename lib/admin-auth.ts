// lib/admin-auth.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function verifyAdmin(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  const token = cookieHeader?.match(/admin-token=([^;]+)/)?.[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return null;
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}