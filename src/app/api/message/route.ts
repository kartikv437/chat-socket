import { NextRequest, NextResponse } from "next/server";

import Message from "@/models/Message";
import jwt from "jsonwebtoken";
import { connectMongo } from "@/lib/mongodb";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    // ✅ get receiverId from query params
    const { searchParams } = new URL(req.url);
    const receiverId = searchParams.get("receiverId");

    if (!receiverId) {
      return NextResponse.json(
        { error: "receiverId required" },
        { status: 400 }
      );
    }

    // ✅ get token from Authorization header
    // const authHeader = req.headers.get("authorization");
    const token = (await cookies()).get("token")?.value;
    // const token = authHeader?.split(" ")[1];
    if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const myUserId = decoded.userId;

    // ✅ fetch messages
    const messages = await Message.find({
      $or: [
        { senderId: myUserId, receiverId },
        { senderId: receiverId, receiverId: myUserId },
      ],
    }).sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const { senderId, receiverId, content } = await req.json();
    await connectMongo();
    const newMessage = new Message({ senderId, receiverId, content });
    await newMessage.save();
    return NextResponse.json(newMessage, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
