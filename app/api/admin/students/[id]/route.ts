export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UpsertStudentSchema } from "@/lib/studentSchema";
import { gradeFromPct, passedFromPct } from "@/lib/grades";
import { Prisma } from "@prisma/client";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const s = await prisma.student.findUnique({ where: { id: params.id }, include: { scores: true } });
  if (!s) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ student: s });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = UpsertStudentSchema.parse(await req.json());

  const values = Object.values(data.scores) as number[];
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / 12;
  const percentage = +(((total / (12 * 100)) * 100).toFixed(2));
  const grade = gradeFromPct(percentage);
  const status = passedFromPct(percentage);

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const s = await tx.student.update({
        where: { id: params.id },
        data: {
          name: data.name,
          mothersName: data.mothersName,
          rollNumber: data.rollNumber,
          school: data.school,
          placeOfExam: data.placeOfExam,
          total, average, percentage, grade, status,
          scores: {
            deleteMany: { studentId: params.id },
            create: Object.entries(data.scores).map(([subject, score]) => ({
              subject: subject as any,
              score: score as number,
            })),
          },
        },
        include: { scores: true },
      });
      return s;
    });

    return NextResponse.json({ ok: true, student: updated });
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Roll number already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.$transaction([
    prisma.subjectScore.deleteMany({ where: { studentId: params.id } }),
    prisma.student.delete({ where: { id: params.id } }),
  ]);
  return NextResponse.json({ ok: true });
}
