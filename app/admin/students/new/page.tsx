"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UpsertStudentSchema, SubjectKeys } from "@/lib/studentSchema";

export default function NewStudentPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<any>({
    resolver: zodResolver(UpsertStudentSchema),
    defaultValues: {
      name: "", mothersName: "", rollNumber: "", school: "", placeOfExam: "",
      scores: Object.fromEntries(SubjectKeys.map(k => [k, 0])),
    },
  });

  async function onSubmit(values: any) {
    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(()=> ({}));
    if (res.ok) {
      alert("Student created");
      router.push(`/admin/dashboard`);
    } else {
      alert(data.error || "Create failed");
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Card><CardContent className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">New Student</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Name</Label><Input {...register("name")} /></div>
            <div><Label>Mother’s Name</Label><Input {...register("mothersName")} /></div>
            <div><Label>Roll Number</Label><Input {...register("rollNumber")} /></div>
            <div><Label>School</Label><Input {...register("school")} /></div>
            <div><Label>Place of Exam</Label><Input {...register("placeOfExam")} /></div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Subject Scores (0–100)</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SubjectKeys.map((k) => (
                <div key={k}>
                  <Label>{k}</Label>
                  <Input type="number" min={0} max={100} {...register(`scores.${k}`, { valueAsNumber: true })} />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save Student"}
          </Button>
        </form>
      </CardContent></Card>
    </main>
  );
}
