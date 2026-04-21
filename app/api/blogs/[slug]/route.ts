// app/api/blogs/[slug]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      comments: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  
  return NextResponse.json(post);
}