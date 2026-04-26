// app/api/admin/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { isValid, userId } = await verifyAdminAuth();
    
    console.log("Comments API - Auth check:", { isValid, userId });
    
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        blogPost: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });
    
    console.log(`Found ${comments.length} comments`);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const { isValid } = await verifyAdminAuth();
    
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { commentId, status } = await request.json();
    
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { status },
    });
    
    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const { isValid } = await verifyAdminAuth();
    
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { commentId } = await request.json();
    
    await prisma.comment.delete({
      where: { id: commentId },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}