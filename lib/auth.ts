import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE = "admin_session";

export async function setSession(adminId: string) {
  const token = await new SignJWT({ sub: adminId, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: true, path: "/" });
}

export async function getSession() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { sub: string; role: "admin" };
  } catch {
    return null;
  }
}

export function clearSession() {
  cookies().set(COOKIE, "", { path: "/", maxAge: 0 });
}
