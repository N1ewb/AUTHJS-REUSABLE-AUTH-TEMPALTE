import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  console.log(session);

  if (session && session.user && session.user.role)
    redirect(
      `/${session.user.role.toLowerCase()}/${session.user.role.toLowerCase()}dashboard`
    );

  return <>{children}</>;
}
