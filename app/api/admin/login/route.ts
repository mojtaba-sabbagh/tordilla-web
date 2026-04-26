// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    console.log("Login attempt for username:", username);

    if (!username || !password) {
      return NextResponse.json(
        { error: "نام کاربری و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    // Find admin user by username
    const admin = await prisma.admin.findFirst({
      where: { username },
    });

    console.log("Admin found:", !!admin);

    if (!admin) {
      return NextResponse.json(
        { error: "نام کاربری یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    console.log("Password valid:", isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "نام کاربری یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Token created successfully");

    // Create response with cookie using NextResponse
    const response = NextResponse.json({
      success: true,
      message: "ورود موفقیت‌آمیز بود",
    });

    // Set the cookie on the response
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: false, // false for localhost (HTTP)
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("Cookie set on response");

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "خطا در ورود به سیستم: " + (error as Error).message },
      { status: 500 }
    );
  }
}