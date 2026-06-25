import DashboardHeader from "@/app/(components)/DashboardHeader";
import Sidebar from "@/app/(components)/Sidebar";

export default async function InstructorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-1">
      <DashboardHeader />
      <Sidebar role="instructor" />
      <div className="flex flex-1 pt-16">{children}</div>
    </main>
  );
}
