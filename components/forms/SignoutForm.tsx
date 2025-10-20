import { logout } from "@/actions/client/user.action";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.refresh();
  };
  return (
    <Button onClick={handleLogout} className="w-full">
      Signout
    </Button>
  );
}
