import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function InstructorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) redirect("/");
  if (session.user.role?.toLowerCase() !== "instructor") redirect("/");

  return <>{children}</>;
}
