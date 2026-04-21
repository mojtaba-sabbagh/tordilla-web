// app/api/admin/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/admin-auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const { title, slug, category, categorySlug, excerpt, content, image, imageWidth, imageHeight, author, published } = body;

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      category,
      categorySlug,
      excerpt,
      content,
      image,
      imageWidth,
      imageHeight,
      author,
      published,
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  
  // Delete comments first
  await prisma.comment.deleteMany({
    where: { blogPostId: id },
  });
  
  await prisma.blogPost.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}