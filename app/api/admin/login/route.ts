export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signAdminToken } from "@/lib/auth";

const Body = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(req: Request) {
  const { email, password } = Body.parse(await req.json());
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const jwt = await signAdminToken({ id: admin.id, email: admin.email });

  const res = NextResponse.json({ ok: true });
  res.headers.set(
    "Set-Cookie",
    `admin=${jwt}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );
  return res;
}
