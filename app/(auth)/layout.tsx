import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingHeader from "../(components)/LandingHeader";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session && session.user && session.user.role) {
    redirect(`/${session.user.role}/${session.user.role}dashboard`);
  }

  return (
    <div className="min-h-screen ">
      <LandingHeader />
      {children}
    </div>
  );
}
