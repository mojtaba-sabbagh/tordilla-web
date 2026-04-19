// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();
    
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'info@TordillaFood.com',
      subject: `تماس با ما: ${subject}`,
      html: `
        <h3>پیام جدید از فرم تماس ترددیلا</h3>
        <p><strong>نام:</strong> ${name}</p>
        <p><strong>ایمیل:</strong> ${email}</p>
        <p><strong>تلفن:</strong> ${phone || 'نامشخص'}</p>
        <p><strong>موضوع:</strong> ${subject}</p>
        <p><strong>پیام:</strong></p>
        <p>${message}</p>
      `,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}