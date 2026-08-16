// app/api/admin/posts/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
  const { isValid } = await verifyAdminAuth();
  
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { id } = await params; // Await params
    
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        comments: true,
      },
    });
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isValid } = await verifyAdminAuth();
  
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { id } = await params; // Await params
    const body = await request.json();

    // Only accept fields that belong to the post; the edit form also sends `id`,
    // and anything unexpected would make Prisma reject the whole update.
    const { slug, title, category, categorySlug, date, image, imageWidth, imageHeight, excerpt, content, author, published } = body;

    const parsedDate = date ? new Date(date) : null;
    const publishedAt = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : undefined;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(slug !== undefined && { slug }),
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(categorySlug !== undefined && { categorySlug }),
        ...(publishedAt !== undefined && { date: publishedAt }),
        ...(image !== undefined && { image }),
        ...(imageWidth !== undefined && { imageWidth: Number(imageWidth) || 800 }),
        ...(imageHeight !== undefined && { imageHeight: Number(imageHeight) || 600 }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(author !== undefined && { author }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? `خطا در ویرایش مطلب: ${error.message}` : 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isValid } = await verifyAdminAuth();
  
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { id } = await params; // Await params
    
    // Delete all comments first (if not using cascade)
    await prisma.comment.deleteMany({
      where: { blogPostId: id },
    });
    
    // Delete the post
    await prisma.blogPost.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}