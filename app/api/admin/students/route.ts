import { NextResponse } from "next/server";
import { PrismaClient, Subject } from "@prisma/client";
import { CreateStudentSchema } from "@/lib/studentSchema";
import { gradeFromPct, passedFromPct } from "@/lib/grades";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = CreateStudentSchema.parse(await req.json());
  const values = Object.values(body.scores) as number[];
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / 12;
  const percentage = +( (total / (12 * 100)) * 100 ).toFixed(2);
  const grade = gradeFromPct(percentage);
  const status = passedFromPct(percentage);

  const student = await prisma.student.create({
    data: {
      name: body.name,
      mothersName: body.mothersName,
      rollNumber: body.rollNumber,
      school: body.school,
      placeOfExam: body.placeOfExam,
      total,
      average,
      percentage,
      grade,
      status,
      scores: {
        create: Object.entries(body.scores).map(([k, v]) => ({
          subject: k as Subject,
          score: v as number,
        }))
      }
    },
    include: { scores: true }
  });

  return NextResponse.json({ ok: true, student });
}
