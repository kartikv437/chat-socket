import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

export async function connectMongo() {
  if (mongoose.connection.readyState >= 1) return;
  console.log("MongoDB connected");
  return mongoose.connect(MONGODB_URL);
}

export async function disconnectMongo() {
  if (mongoose.connection.readyState >= 1) return mongoose.disconnect();
}