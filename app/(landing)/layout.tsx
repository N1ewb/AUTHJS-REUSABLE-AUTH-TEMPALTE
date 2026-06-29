import { auth } from "@/lib/auth";
import LandingHeader from "../(components)/LandingHeader";
import { redirect } from "next/navigation";
export default async function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session && session.user && session.user.role) {
    redirect(`/${session.user.role.toLowerCase()}/dashboard`);
  }
  return (
    <main className="flex flex-col min-h-0 ">
      <LandingHeader />
      <div className="flex flex-col min-h-0 overflow-auto">{children}</div>
    </main>
  );
}
