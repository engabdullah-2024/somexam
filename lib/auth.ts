import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

export async function signAdminToken(payload: { id: string; email: string }) {
  return await new SignJWT({ email: payload.email } as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyAdminToken(token: string) {
  return await jwtVerify(token, SECRET);
}
