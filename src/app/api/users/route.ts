import { NextResponse } from "next/server";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectMongo } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectMongo();

    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const users = await User.find({
      _id: { $ne: decoded.userId },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("FETCH USERS ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
