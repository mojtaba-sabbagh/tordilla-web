// app/api/admin/comments/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/admin-auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response, auth } = await checkAdminAuth();
  if (response) return response; // Unauthorized → returns 401
  if (!auth.isValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await prisma.comment.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}