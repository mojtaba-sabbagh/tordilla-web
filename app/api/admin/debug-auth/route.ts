// app/api/admin/debug-auth/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const token = cookieStore.get("admin_token");
  
  return NextResponse.json({
    hasToken: !!token,
    tokenValue: token?.value ? `${token.value.substring(0, 50)}...` : null,
    allCookies: allCookies.map(c => ({ name: c.name, value: c.value?.substring(0, 20) })),
    cookieCount: allCookies.length
  });
}