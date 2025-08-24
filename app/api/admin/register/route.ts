export const runtime = "nodejs";  // avoid Edge for Prisma

import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const { email, password } = Body.parse(await req.json());

    const count = await prisma.admin.count();
    if (count > 0) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 403 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await prisma.admin.create({ data: { email, passwordHash } });

    return NextResponse.json({ ok: true, adminId: admin.id });
  } catch (err: any) {
    console.error("REGISTER_ERROR:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
