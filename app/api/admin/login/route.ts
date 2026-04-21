// app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    console.log('Login attempt for username:', username);
    
    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { username: username },
    });
        
    if (!admin) {
      return NextResponse.json(
        { error: 'نام کاربری یا رمز عبور نادرست است' },
        { status: 401 }
      );
    }
    
    // Compare password
    const isValid = await bcrypt.compare(password, admin.password);
        
    if (!isValid) {
      return NextResponse.json(
        { error: 'نام کاربری یا رمز عبور نادرست است' },
        { status: 401 }
      );
    }
    
    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Generate token
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Create response with cookie
    const response = NextResponse.json({ 
      success: true,
      redirect: '/admin'
    });
    
    // Set cookie
    response.cookies.set({
      name: 'admin-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    console.log('Login successful, token set');
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'خطا در سرور. لطفاً مجدد تلاش کنید.' },
      { status: 500 }
    );
  }
}