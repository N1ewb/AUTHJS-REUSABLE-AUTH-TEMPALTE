import LandingHeader from "../(components)/LandingHeader";
export default async function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen flex flex-1">
      <LandingHeader />
      {children}
    </main>
  );
}
