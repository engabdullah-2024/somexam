"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function HomePage() {
  const [roll, setRoll] = useState("");
  const router = useRouter();

  return (
    <main className="mx-auto max-w-xl p-6">
      <Card className="shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-semibold">Exam Result Lookup</h1>
          <div className="space-y-2">
            <Label htmlFor="roll">Enter Roll Number</Label>
            <Input id="roll" value={roll} onChange={e => setRoll(e.target.value)} placeholder="e.g. 1-9" />
          </div>
          <Button className="w-full" onClick={() => roll && router.push(`/results/${encodeURIComponent(roll)}`)}>
            View Result
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
