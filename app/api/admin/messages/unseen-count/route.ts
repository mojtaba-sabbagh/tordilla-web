// app/api/admin/messages/unseen-count/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/admin-auth";

export async function GET() {
  try {
    // Verify admin authentication
    const { isValid } = await verifyAdminAuth();
    
    if (!isValid) {
      return NextResponse.json({ count: 0 }, { status: 200 });
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
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}