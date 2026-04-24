// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message, toEmail } = await request.json();
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'لطفاً تمام فیلدهای ضروری را پر کنید' },
        { status: 400 }
      );
    }
    
    // Configure email transporter for it@tordilla.ir (fixed FROM address)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER, // it@tordilla.ir
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Verify connection
    await transporter.verify();
    
    // Target email (can be changed dynamically or use default)
    const targetEmail = toEmail || process.env.CONTACT_TO_EMAIL || 'it@tordilla.ir';
    
    // Send email to target recipient (CEO, IT, etc.)
    await transporter.sendMail({
      from: `"فرم تماس ترددیلا" <${process.env.SMTP_USER}>`, // Fixed: it@tordilla.ir
      replyTo: email, // When replying, goes to the user
      to: targetEmail, // Can be changed to CEO, sales, support, etc.
      subject: `تماس با ما: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Tahoma, Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #8f1d1d; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #8f1d1d; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>پیام جدید از فرم تماس ترددیلا</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">نام و نام خانوادگی:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">ایمیل:</div>
                <div class="value">${email}</div>
              </div>
              ${phone ? `
              <div class="field">
                <div class="label">تلفن تماس:</div>
                <div class="value">${phone}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">موضوع:</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">پیام:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>این پیام از فرم تماس سایت ارسال شده است.</p>
              <p>برای پاسخ، روی "پاسخ" کلیک کنید تا مستقیماً به کاربر ایمیل بزنید.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
پیام جدید از فرم تماس ترددیلا
─────────────────────────
نام: ${name}
ایمیل: ${email}
${phone ? `تلفن: ${phone}\n` : ''}
موضوع: ${subject}
─────────────────────────
پیام:
${message}
─────────────────────────
این پیام از فرم تماس سایت ارسال شده است.
برای پاسخ، مستقیماً به ایمیل ${email} پاسخ دهید.
      `,
    });
    
    // Optional: Send auto-reply to user
    await transporter.sendMail({
      from: `"ترددیلا" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'دریافت پیام شما - ترددیلا',
      html: `
        <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #8f1d1d; color: white; padding: 20px; text-align: center; border-radius: 10px;">
            <h2>با تشکر از تماس شما</h2>
          </div>
          <div style="padding: 20px; background: #f9f9f9; border-radius: 10px; margin-top: 10px;">
            <p>${name} عزیز،</p>
            <p>پیام شما با موفقیت دریافت شد. در اسرع وقت با شما تماس خواهیم گرفت.</p>
            <p>با احترام،<br><strong>تیم ترددیلا</strong></p>
          </div>
        </div>
      `,
    });
    
    return NextResponse.json({ success: true, message: 'پیام با موفقیت ارسال شد' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'خطا در ارسال پیام. لطفاً مجدد تلاش کنید' },
      { status: 500 }
    );
  }
}