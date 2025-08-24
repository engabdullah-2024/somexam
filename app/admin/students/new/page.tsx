"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateStudentSchema, SubjectKeys } from "@/lib/studentSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NewStudent() {
  const { register, handleSubmit, formState:{ isSubmitting } } = useForm<any>({
    resolver: zodResolver(CreateStudentSchema),
    defaultValues: { scores: Object.fromEntries(SubjectKeys.map(k=>[k, 0])) }
  });

  async function onSubmit(values: any) {
    const res = await fetch("/api/admin/students", { method:"POST", body: JSON.stringify(values) });
    if (res.ok) { alert("Saved"); }
    else alert("Error saving student");
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Card><CardContent className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">Register Student</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><Label>Name</Label><Input {...register("name")} /></div>
            <div><Label>Mother’s Name</Label><Input {...register("mothersName")} /></div>
            <div><Label>Roll Number</Label><Input {...register("rollNumber")} /></div>
            <div><Label>School</Label><Input {...register("school")} /></div>
            <div><Label>Place of Exam</Label><Input {...register("placeOfExam")} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SubjectKeys.map(k=>(
              <div key={k}>
                <Label>{k}</Label>
                <Input type="number" min={0} max={100} {...register(`scores.${k}`, { valueAsNumber: true })} />
              </div>
            ))}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">Save</Button>
        </form>
      </CardContent></Card>
    </main>
  );
}
