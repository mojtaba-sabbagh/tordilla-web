// app/api/admin/messages/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/admin-auth';

// IMPORTANT: The params is a Promise in Next.js 15, so we need to await it
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    // Verify admin authentication
    const { isValid } = await verifyAdminAuth();
    
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Await params to get the id - This is the key fix!
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
    const { status } = await request.json();
    
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
  { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    // Verify admin authentication
    const { isValid } = await verifyAdminAuth();
    
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Await params to get the id - This is the key fix!
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
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