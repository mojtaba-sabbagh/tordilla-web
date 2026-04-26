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
    
    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        category,
        categorySlug,
        date: new Date(date),
        image,
        imageWidth: imageWidth || 800,
        imageHeight: imageHeight || 600,
        excerpt,
        content,
        author,
        published: published || false,
      },
    });
    
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}