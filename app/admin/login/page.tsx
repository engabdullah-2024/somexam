"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminLogin() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const router = useRouter();

  async function onSubmit() {
    const res = await fetch("/api/admin/login", { method:"POST", body: JSON.stringify({ email, password }) });
    if (res.ok) router.push("/admin/students/new");
    else alert("Invalid credentials");
  }

  return (
    <main className="mx-auto max-w-sm p-6">
      <Card><CardContent className="p-6 space-y-3">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <Button className="w-full" onClick={onSubmit}>Login</Button>
      </CardContent></Card>
    </main>
  );
}
