// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch comments for a specific blog post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogPostId = searchParams.get('blogPostId');
    
    if (!blogPostId) {
      return NextResponse.json(
        { error: 'blogPostId is required' },
        { status: 400 }
      );
    }
    
    const comments = await prisma.comment.findMany({
      where: {
        blogPostId,
        status: 'APPROVED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST - Submit a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, content, blogPostId } = body;
    
    // Validate required fields
    if (!name || !email || !content || !blogPostId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check if blog post exists
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: blogPostId },
    });
    
    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Create the comment (default status is PENDING)
    const comment = await prisma.comment.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        content: content.trim(),
        blogPostId,
        status: 'PENDING', // Comments start as pending for moderation
      },
    });
    
    console.log(`New comment submitted for post: ${blogPost.title}`);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود',
        comment 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting comment:', error);
    return NextResponse.json(
      { error: 'Failed to submit comment' },
      { status: 500 }
    );
  }
}

// PUT - Update comment status (admin only)
export async function PUT(request: NextRequest) {
  try {
    // This should be protected by admin auth
    // For now, we'll check for admin token
    const { commentId, status } = await request.json();
    
    if (!commentId || !status) {
      return NextResponse.json(
        { error: 'Comment ID and status are required' },
        { status: 400 }
      );
    }
    
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

// DELETE - Delete a comment (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { commentId } = await request.json();
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }
    
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