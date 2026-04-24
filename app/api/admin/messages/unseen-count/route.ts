// app/api/admin/messages/unseen-count/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function GET() {
  try {
    // Verify admin authentication
    const cookieStore = cookies();
    const token = cookieStore.get("admin_token");

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
      jwt.verify(token.value, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Count unseen messages
    const count = await prisma.contactMessage.count({
      where: {
        status: "UNSEEN",
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting messages:", error);
    return NextResponse.json({ error: "خطا در شمارش پیام‌ها" }, { status: 500 });
  }
}