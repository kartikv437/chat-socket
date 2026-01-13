import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AuthProvider } from "@/providers/AuthProvider";
import ChatClient from "./ChatClient";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const token = (await cookies()).get("token")?.value;
  if (!token) throw new Error("Unauthorized");

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  return (
    <AuthProvider token={token} myUserId={decoded.userId}>
      <ChatClient receiverId={userId} />
    </AuthProvider>
  );
}
