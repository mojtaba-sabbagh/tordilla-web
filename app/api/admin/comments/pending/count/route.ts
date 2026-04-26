// app/api/admin/comments/pending/count/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { isValid } = await verifyAdminAuth();
    
    console.log("Comments pending count - Auth check:", { isValid });
    
    if (!isValid) {
      return NextResponse.json({ count: 0 }, { status: 200 }); // Return 0 instead of 401
    }
    
    const count = await prisma.comment.count({
      where: {
        status: 'PENDING'
      }
    });

    console.log(`Pending comments count: ${count}`);
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching pending comments count:', error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}