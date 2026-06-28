import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Mail, BadgeInfo, Calendar } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/");

  const user = session.user;
  const name =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || "User";
  const role = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "";

  return (
    <div className="flex flex-col min-h-0 w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-card-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your account details and information.
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-[#56205E] to-[#B343C4] px-6 py-8">
          <div className="w-16 h-16 rounded-full bg-card/20 flex items-center justify-center text-white text-2xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-white mt-3">{name}</h2>
          <span className="inline-block mt-1 text-xs font-medium bg-card/20 text-white px-2.5 py-0.5 rounded-full">
            {role}
          </span>
        </div>

        <div className="divide-y divide-border">
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-card-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium text-card-foreground">{name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <BadgeInfo className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-medium text-card-foreground">{role}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">User ID</p>
              <p className="text-sm font-mono text-card-foreground">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
