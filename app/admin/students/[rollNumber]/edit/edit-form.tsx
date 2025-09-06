"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UpsertStudentSchema, SubjectKeys } from "@/lib/studentSchema";

type StudentWithScores = {
  id: string;
  name: string;
  mothersName: string;
  rollNumber: string;
  school: string;
  placeOfExam: string;
  scores: { id: string; subject: string; score: number }[];
};

export default function EditStudentForm({ student }: { student: StudentWithScores }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Map existing scores -> { [SUBJECT]: number }
  const defaultScores = useMemo(() => {
    const map: Record<string, number> = {};
    for (const k of SubjectKeys) map[k] = 0;
    for (const row of student.scores) map[row.subject] = row.score ?? 0;
    return map;
  }, [student.scores]);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<any>({
    resolver: zodResolver(UpsertStudentSchema),
    defaultValues: {
      name: student.name,
      mothersName: student.mothersName,
      rollNumber: student.rollNumber,
      school: student.school,
      placeOfExam: student.placeOfExam,
      scores: defaultScores,
    },
  });

  async function onSubmit(values: any) {
    setSaving(true);
    const res = await fetch(`/api/admin/students/${student.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (res.ok) {
      alert("Student updated");
      router.push("/admin/dashboard");
    } else {
      alert(data.error || "Update failed");
    }
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input {...register("name")} />
            </div>
            <div>
              <Label>Mother’s Name</Label>
              <Input {...register("mothersName")} />
            </div>
            <div>
              <Label>Roll Number</Label>
              <Input {...register("rollNumber")} />
            </div>
            <div>
              <Label>School</Label>
              <Input {...register("school")} />
            </div>
            <div>
              <Label>Place of Exam</Label>
              <Input {...register("placeOfExam")} />
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Subject Scores (0–100)</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SubjectKeys.map((k) => (
                <div key={k}>
                  <Label>{k}</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    {...register(`scores.${k}`, { valueAsNumber: true })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || saving}>
              {isSubmitting || saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
