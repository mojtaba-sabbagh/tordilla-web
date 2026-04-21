// app/api/admin/posts/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/admin-auth';

export async function GET(request: Request) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const posts = await prisma.blogPost.findMany({
    orderBy: { date: 'desc' },
    include: {
      comments: true,
    },
  });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const body = await request.json();
  const { title, slug, category, categorySlug, excerpt, content, image, imageWidth, imageHeight, author, published } = body;

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      category,
      categorySlug,
      excerpt,
      content,
      image,
      imageWidth: imageWidth || 800,
      imageHeight: imageHeight || 600,
      author,
      published,
    },
  });

  return NextResponse.json(post, { status: 201 });
}