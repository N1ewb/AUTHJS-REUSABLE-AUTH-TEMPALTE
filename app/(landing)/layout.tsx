import LandingHeader from "../(components)/LandingHeader";
export default async function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col min-h-screen">
      <LandingHeader />
      {children}
    </main>
  );
}
