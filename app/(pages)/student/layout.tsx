import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) redirect("/");
  if (session.user.role?.toLowerCase() !== "student") redirect("/");

  return <>{children}</>;
}
