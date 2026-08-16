// app/api/admin/posts/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  // Check authentication
  const auth = await verifyAdminAuth();
  
  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Use BlogPost model instead of post
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        comments: true, // Include comments count if needed
      },
    });
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth();
  
  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { slug, title, category, categorySlug, date, image, imageWidth, imageHeight, excerpt, content, author, published } = body;

    if (!slug || !categorySlug) {
      return NextResponse.json(
        { error: 'آدرس مطلب (slug) و دسته‌بندی الزامی است.' },
        { status: 400 }
      );
    }

    // `date` is optional from the form; the column defaults to now(). Only pass a
    // value through when it actually parses, otherwise Prisma rejects Invalid Date.
    const parsedDate = date ? new Date(date) : null;
    const publishedAt = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : new Date();

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'مطلبی با این آدرس (slug) از قبل وجود دارد.' },
        { status: 409 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        category,
        categorySlug,
        date: publishedAt,
        image: image || '',
        imageWidth: Number(imageWidth) || 800,
        imageHeight: Number(imageHeight) || 600,
        excerpt,
        content,
        author,
        published: published ?? false,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? `خطا در ایجاد مطلب: ${error.message}` : 'Failed to create post' },
      { status: 500 }
    );
  }
}