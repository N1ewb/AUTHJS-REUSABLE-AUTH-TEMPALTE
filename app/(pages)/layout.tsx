import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "../(components)/Sidebar";
import DashboardHeader from "../(components)/DashboardHeader";
import Breadcrumbs from "../(components)/Breadcrumbs";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) redirect("/");

  const role = session.user.role?.toLowerCase() as "instructor" | "student";

  return (
    <div className="flex flex-col min-h-0">
      <DashboardHeader />
      <div className="flex flex-1 min-h-0">
        <Sidebar role={role} />
        <main className="flex flex-1 flex-col pt-20 px-8 py-6 min-h-0 overflow-y-auto">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
