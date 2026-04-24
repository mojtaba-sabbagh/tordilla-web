// app/api/admin/messages/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const id = parseInt(params.id);
    
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
    
    return NextResponse.json({ success: true, message: updated });
    
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'خطا در بروزرسانی پیام' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    await prisma.contactMessage.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'خطا در حذف پیام' },
      { status: 500 }
    );
  }
}