// app/admin/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState<boolean | null>(null);
  const [existingEmail, setExistingEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Probe if an admin exists already
    fetch("/api/admin/register")
      .then((r) => r.json())
      .then((d) => {
        setExists(Boolean(d?.exists));
        setExistingEmail(d?.email ?? null);
      })
      .catch(() => setExists(null));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("Admin registered successfully!");
        router.push("/admin/login");
      } else {
        alert(data.error || `HTTP ${res.status}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm p-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-semibold">Register Admin</h1>

          {exists ? (
            <div className="space-y-3">
              <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm">
                <p className="font-medium">An admin is already registered.</p>
                {existingEmail && (
                  <p className="text-muted-foreground mt-1">
                    <Badge variant="outline">{existingEmail}</Badge>
                  </p>
                )}
              </div>
              <Button className="w-full" onClick={() => router.push("/admin/login")}>
                Go to Login
              </Button>

              {/* DEV ONLY: quick reset during testing */}
              {process.env.NODE_ENV === "development" && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    if (!confirm("Delete all admins? (dev only)")) return;
                    const r = await fetch("/api/admin/register", { method: "DELETE" });
                    if (r.ok) {
                      alert("Cleared. You can register now.");
                      setExists(false);
                    } else {
                      alert("Failed to clear admins.");
                    }
                  }}
                >
                  Dev: Clear Admins
                </Button>
              )}
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading || exists === null}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
