export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [all, passed, failed] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { status: "PASSED" } }),
    prisma.student.count({ where: { status: "FAILED" } }),
  ]);
  return NextResponse.json({ all, passed, failed });
}
