export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UpsertStudentSchema } from "@/lib/studentSchema";
import { gradeFromPct, passedFromPct } from "@/lib/grades";
import { Prisma } from "@prisma/client";

// GET /api/admin/students?status=ALL|PASSED|FAILED&q=...&page=1&pageSize=20
export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = (url.searchParams.get("status") ?? "ALL") as "ALL" | "PASSED" | "FAILED";
  const q = url.searchParams.get("q") ?? "";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize") ?? 20)));

  const where: Prisma.StudentWhereInput = {
    AND: [
      status === "ALL" ? {} : { status },
      q
        ? {
            OR: [
              { rollNumber: { contains: q } },
              { name: { contains: q, mode: "insensitive" } },
              { school: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };

  const [total, items] = await Promise.all([
    prisma.student.count({ where }),
    prisma.student.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { scores: true },
    }),
  ]);

  return NextResponse.json({ total, items, page, pageSize });
}

// POST create new student with derived fields
export async function POST(req: Request) {
  const data = UpsertStudentSchema.parse(await req.json());

  const values = Object.values(data.scores) as number[];
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / 12;
  const percentage = +(((total / (12 * 100)) * 100).toFixed(2));
  const grade = gradeFromPct(percentage);
  const status = passedFromPct(percentage);

  try {
    const created = await prisma.student.create({
      data: {
        name: data.name,
        mothersName: data.mothersName,
        rollNumber: data.rollNumber,
        school: data.school,
        placeOfExam: data.placeOfExam,
        total, average, percentage, grade, status,
        scores: {
          create: Object.entries(data.scores).map(([subject, score]) => ({
            subject: subject as any,
            score: score as number,
          })),
        },
      },
      include: { scores: true },
    });
    return NextResponse.json({ ok: true, student: created });
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Roll number already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 400 });
  }
}
