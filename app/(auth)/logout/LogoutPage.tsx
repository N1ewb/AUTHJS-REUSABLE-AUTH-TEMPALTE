"use client";
import { logout } from "@/actions/client/user.action";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      router.refresh();
      router.back();
    };
    performLogout();
  }, [router]);

  return (
    <p className="text-center text-muted-foreground mt-8">Logging out...</p>
  );
}

export default LogoutPage;
