// app/api/admin/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the admin_token cookie
  response.cookies.set({
    name: "admin_token",
    value: "",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 0, // Expire immediately
    path: "/",
  });
  
  return response;
}