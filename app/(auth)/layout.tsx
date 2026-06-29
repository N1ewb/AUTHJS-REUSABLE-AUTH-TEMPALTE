import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingHeader from "../(components)/LandingHeader";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const validRoles = ["instructor", "student", "admin"];

  if (
    session &&
    session.user &&
    session.user.role &&
    validRoles.includes(session.user.role.toLowerCase())
  ) {
    redirect(`/${session.user.role.toLowerCase()}/dashboard`);
  }

  return (
    <div className="flex flex-col min-h-0">
      <LandingHeader />
      <div className="flex flex-col min-h-0 overflow-auto">{children}</div>
    </div>
  );
}
