// app/admin/students/[rollNumber]/edit/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import EditStudentForm from "../edit/edit-form";

export const runtime = "nodejs";

export default async function EditStudentPage({
  params,
}: { params: Promise<{ rollNumber: string }> }) {
  const { rollNumber } = await params; // Next 15: await params
  const roll = decodeURIComponent(rollNumber);

  const student = await prisma.student.findUnique({
    where: { rollNumber: roll },
    include: { scores: true },
  });

  if (!student) {
    return (
      <main className="min-h-[60dvh] grid place-items-center p-6">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Student not found</p>
          <p className="text-muted-foreground">Roll number: {roll}</p>
          <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-primary hover:underline mt-2">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Student</h1>
        <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="inline mr-1 h-4 w-4" /> Back
        </Link>
      </div>
      <EditStudentForm student={student} />
    </main>
  );
}
