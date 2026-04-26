// lib/admin-auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export interface AuthResult {
  isValid: boolean;
  userId?: number;
  error?: string;
}

export async function verifyAdminAuth(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');
    
    if (!token || !token.value) {
      return { isValid: false, error: 'No token found' };
    }
    
    const decoded = jwt.verify(token.value, JWT_SECRET) as { id: number; email: string };
    return { isValid: true, userId: decoded.id };
  } catch (error) {
    return { isValid: false, error: 'Invalid token' };
  }
}

// Alias for verifyAdminAuth to support both import names
export const verifyAdmin = verifyAdminAuth;

// For API routes that need to check auth and return response
export async function checkAdminAuth(request?: NextRequest): Promise<{ response?: NextResponse; auth: AuthResult }> {
  const auth = await verifyAdminAuth();
  
  if (!auth.isValid) {
    return {
      auth,
      response: NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      ),
    };
  }
  
  return { auth };
}