// app/api/admin/register/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * GET /api/admin/register
 * Quick probe to see if an admin already exists.
 */
export async function GET() {
  const count = await prisma.admin.count();
  if (count > 0) {
    const first = await prisma.admin.findFirst({ select: { email: true } });
    return NextResponse.json({ exists: true, count, email: first?.email ?? null });
  }
  return NextResponse.json({ exists: false, count: 0 });
}

/**
 * POST /api/admin/register
 * Creates the very first admin only.
 */
export async function POST(req: Request) {
  try {
    const { email, password } = Body.parse(await req.json());

    // Allow exactly one admin in the system
    const existing = await prisma.admin.findFirst({ select: { id: true, email: true } });
    if (existing) {
      return NextResponse.json(
        { error: "An admin is already registered. Please log in.", email: existing.email },
        { status: 403 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await prisma.admin.create({
      data: { email, passwordHash },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, adminId: admin.id });
  } catch (err: any) {
    // If someone hit POST twice at the same time, this catches unique(email)
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "An admin is already registered. Please log in." },
        { status: 403 }
      );
    }
    console.error("REGISTER_ERROR:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/register
 * Dev-only helper to clear all admins when you’re testing.
 * REMOVE this in production.
 */
export async function DELETE() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 405 });
  }
  await prisma.admin.deleteMany({});
  return NextResponse.json({ ok: true });
}
