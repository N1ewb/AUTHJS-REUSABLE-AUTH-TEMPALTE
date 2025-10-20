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

  return (
    <main className="flex flex-1">
      <div className="flex flex-1">{children}</div>
    </main>
  );
}
