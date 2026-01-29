import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectMongo } from "@/lib/mongodb";

export async function PATCH(
  request: Request,
  { params }:
    { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();

    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    const body = await request.json();
    const allowedFields = ["user_name", "first_name","middle_name", "last_name","email", "age", "gender", "dob"];
    const updateData: any = {};

    for (const key of allowedFields) {
      if (body[key]) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields provided" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      (await params).id,
      updateData,
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
