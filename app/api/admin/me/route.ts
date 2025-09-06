// app/api/admin/me/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyAdminToken } from "@/lib/auth"; // your existing JWT verify

export async function GET() {
  const token = cookies().get("admin")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { subject } = await verifyAdminToken(token); // subject = admin.id
    const admin = await prisma.admin.findUnique({
      where: { id: subject },
      select: { id: true, email: true },
    });
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ admin });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
