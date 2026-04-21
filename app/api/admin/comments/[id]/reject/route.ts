// app/api/admin/comments/[id]/reject/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/admin-auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  
  const comment = await prisma.comment.update({
    where: { id },
    data: { status: 'REJECTED' },
  });

  return NextResponse.json(comment);
}