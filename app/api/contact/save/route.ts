// app/api/contact/save/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  // Initialize with default values to satisfy TypeScript
  let name: string = '';
  let email: string = '';
  let phone: string | undefined;
  let subject: string = '';
  let message: string = '';

  try {
    const body = await request.json();
    name = body.name;
    email = body.email;
    phone = body.phone;
    subject = body.subject;
    message = body.message;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'لطفاً تمام فیلدهای ضروری را پر کنید' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'لطفاً یک ایمیل معتبر وارد کنید' },
        { status: 400 }
      );
    }
    
    // Save to database using Prisma ORM
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
        status: 'UNSEEN',
      },
    });
    
    console.log('Message saved successfully:', {
      id: contactMessage.id,
      name: contactMessage.name,
      email: contactMessage.email,
      subject: contactMessage.subject,
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'پیام شما با موفقیت ثبت شد. با تشکر!',
        id: contactMessage.id
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('Error saving message:', error);
    
    // Check for specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'این ایمیل قبلاً ثبت شده است' },
        { status: 400 }
      );
    }
    
    if (error.code === 'P2021') {
      // Table doesn't exist - try to create it
      try {
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "ContactMessage" (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "name" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "phone" TEXT,
            "subject" TEXT NOT NULL,
            "message" TEXT NOT NULL,
            "status" TEXT NOT NULL DEFAULT 'UNSEEN',
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL
          )
        `;
        
        // Retry the insert - variables are now definitely assigned
        const contactMessage = await prisma.contactMessage.create({
          data: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone?.trim() || null,
            subject: subject.trim(),
            message: message.trim(),
            status: 'UNSEEN',
          },
        });
        
        return NextResponse.json(
          { 
            success: true, 
            message: 'پیام شما با موفقیت ثبت شد. با تشکر!',
            id: contactMessage.id
          },
          { status: 200 }
        );
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        return NextResponse.json(
          { error: 'خطا در ثبت پیام. لطفاً مجدد تلاش کنید' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'خطا در ثبت پیام. لطفاً مجدد تلاش کنید' },
      { status: 500 }
    );
  }
}