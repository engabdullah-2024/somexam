import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { setSession } from "@/lib/auth";
const prisma = new PrismaClient();

const Body = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(req: Request) {
  const { email, password } = Body.parse(await req.json());
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash)))
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  await setSession(admin.id);
  return NextResponse.json({ ok: true });
}
