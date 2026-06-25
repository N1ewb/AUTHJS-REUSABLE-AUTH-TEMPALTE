import { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: Session | null = await auth();
  if (!session) return redirect(`/`);

  return <>{children}</>;
}
