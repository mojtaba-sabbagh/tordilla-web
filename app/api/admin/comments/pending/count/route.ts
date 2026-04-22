import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // ✅ FIX: Await the cookies() function because it returns a Promise
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the token here if needed
    // const decoded = verify(token.value, process.env.JWT_SECRET!);
    
    const count = await prisma.comment.count({
      where: {
        status: 'PENDING'
      }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching pending comments count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending comments count' },
      { status: 500 }
    );
  }
}