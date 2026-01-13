import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectMongo } from "@/lib/mongodb";
import { Message } from "@/models/Message";

export async function GET(
  context: { params: { userId: string } }
  
) {
  try {
      console.log('test');

    await connectMongo();

    // ✅ await params
    const { userId } = await context.params;

    // get logged-in user from JWT
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const senderId = decoded.userId;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId: userId },
        { senderId: userId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (err) {
    console.error("CHAT FETCH ERROR:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
