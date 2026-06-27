import DashboardHeader from "@/app/(components)/DashboardHeader";
import Sidebar from "@/app/(components)/Sidebar";
import Breadcrumbs from "@/app/(components)/Breadcrumbs";

export default async function InstructorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-1 flex-grow min-h-0">
      <Sidebar role="instructor" />
      <DashboardHeader />
      <div className="flex flex-1 flex-col pt-20 px-8 py-6 flex-grow min-h-0">
        <Breadcrumbs />
        {children}
      </div>
    </main>
  );
}
