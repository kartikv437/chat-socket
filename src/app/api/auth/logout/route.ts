import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // ✅ Clear JWT cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // ⛔ expire immediately
    path: "/",
  });

  return response;
}
