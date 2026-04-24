// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'لطفاً تمام فیلدهای ضروری را پر کنید' },
        { status: 400 }
      );
    }
    
    // Save to database
    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: 'UNSEEN',
      },
    });
    
    // Optional: Still try to send email as backup, but don't fail if email fails
    try {
      // You can keep the email sending code here as a backup
      // But wrap it in try-catch so it doesn't break the main flow
      await sendEmailNotification(name, email, phone, subject, message);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't return error to user, just log it
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'پیام شما با موفقیت ثبت شد',
      id: contact.id 
    });
    
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت پیام. لطفاً مجدد تلاش کنید' },
      { status: 500 }
    );
  }
}

// Optional backup email function
async function sendEmailNotification(name: string, email: string, phone: string | null, subject: string, message: string) {
  // Your existing email code here, but make it optional
  // You can skip this if you don't want email at all
}