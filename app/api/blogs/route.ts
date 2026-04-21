// app/api/blogs/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '8');
  const category = searchParams.get('category');
  
  const skip = (page - 1) * limit;
  
  const where = {
    published: true,
    ...(category && { categorySlug: category }),
  };
  
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
      include: {
        comments: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    prisma.blogPost.count({ where }),
  ]);
  
  return NextResponse.json({
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}