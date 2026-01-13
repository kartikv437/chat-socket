import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectMongo } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
    const { email, password} = await request.json();
    if (!email || !password) {
        return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }
    await connectMongo();
    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
        return NextResponse.json({ success: false, message: "User already exists" }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email,
        password: hashedPassword,
    });
    console.log('newUser',newUser);
    
    try {
        await newUser.save();
        return NextResponse.json({ success: true, message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}