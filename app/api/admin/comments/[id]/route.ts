// app/api/admin/comments/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/admin-auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  
  await prisma.comment.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}