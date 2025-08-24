export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UpsertStudentSchema } from "@/lib/studentSchema";
import { gradeFromPct, passedFromPct } from "@/lib/grades";
import { Prisma } from "@prisma/client";

// GET: fetch current student (for the edit form)
export async function GET(
  _req: Request,
  { params }: { params: { rollNumber: string } }
) {
  const student = await prisma.student.findUnique({
    where: { rollNumber: decodeURIComponent(params.rollNumber) },
    include: { scores: true },
  });
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ student });
}

// PUT: replace ALL fields + ALL 12 subject scores
export async function PUT(
  req: Request,
  { params }: { params: { rollNumber: string } }
) {
  try {
    const currentRoll = decodeURIComponent(params.rollNumber);
    const body = UpsertStudentSchema.parse(await req.json());

    // Must exist first
    const existing = await prisma.student.findUnique({
      where: { rollNumber: currentRoll },
      include: { scores: true }
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Compute totals
    const values = Object.values(body.scores) as number[];
    const total = values.reduce((a, b) => a + b, 0);
    const average = total / 12;
    const percentage = +(((total / (12 * 100)) * 100).toFixed(2));
    const grade = gradeFromPct(percentage);
    const status = passedFromPct(percentage);

    // Replace all subject scores (simplest + consistent)
    const updated = await prisma.$transaction(async (tx) => {
      // Update student core fields (including possibly new rollNumber)
      const student = await tx.student.update({
        where: { id: existing.id },
        data: {
          name: body.name,
          mothersName: body.mothersName,
          rollNumber: body.rollNumber,    // may be changed
          school: body.school,
          placeOfExam: body.placeOfExam,
          total, average, percentage, grade, status,
          scores: {
            deleteMany: { studentId: existing.id },
            create: Object.entries(body.scores).map(([subject, score]) => ({
              subject: subject as any,
              score: score as number,
            })),
          },
        },
        include: { scores: true }
      });
      return student;
    });

    return NextResponse.json({ ok: true, student: updated });
  } catch (e: any) {
    // Handle unique constraint on new rollNumber
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Roll number already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 400 });
  }
}
