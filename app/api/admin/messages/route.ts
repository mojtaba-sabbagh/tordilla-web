// app/api/admin/messages/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    const where = status && status !== 'ALL' ? { status: status as any } : {};
    
    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: {
          createdAt: 'desc', // Newest first
        },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
    ]);
    
    return NextResponse.json({
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت پیام‌ها' },
      { status: 500 }
    );
  }
}