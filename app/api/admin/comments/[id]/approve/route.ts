// app/api/admin/comments/[id]/approve/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/admin-auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response, auth } = await checkAdminAuth();
  if (response) return response; // Unauthorized response
  if (!auth.isValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const comment = await prisma.comment.update({
    where: { id },
    data: { status: 'APPROVED' },
  });

  return NextResponse.json(comment);
}