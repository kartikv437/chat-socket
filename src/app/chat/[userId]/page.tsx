import ChatClient from "./ChatClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params; // ✅ await params

  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login");

  return <ChatClient receiverId={userId} />;
}
