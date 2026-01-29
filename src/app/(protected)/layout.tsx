// src/app/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login");

  jwt.verify(token, process.env.JWT_SECRET!);

  return <>{children}</>;
}
