// app/admin/dashboard/admin-user.tsx
"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminUser() {
  const router = useRouter();
  const { data } = useSWR("/api/admin/me", fetcher);
  const email = data?.admin?.email as string | undefined;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <div className="flex items-center gap-2">
      {email && (
        <Badge variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="font-medium">{email}</span>
        </Badge>
      )}
      <Button variant="outline" size="sm" onClick={logout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}
