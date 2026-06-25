import DashboardHeader from "@/app/(components)/DashboardHeader";

export default async function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-1">
      <DashboardHeader />
      <div className="flex flex-1">{children}</div>
    </main>
  );
}
