import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const username = body?.username;
  const password = body?.password;

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, password: true, role: true, status: true },
  });

  if (!user) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  // Use async bcrypt to avoid blocking the event loop on serverless
  let passwordMatch = false;
  try {
    passwordMatch = await bcrypt.compare(password, user.password);
  } catch (err) {
    passwordMatch = false;
  }

  // Lazy migration: if bcrypt fails, try plain-text (legacy passwords)
  if (!passwordMatch && user.password === password) {
    passwordMatch = true;
    // Fire-and-forget: upgrade the password in the background.
    // Cost factor 8 is sufficient and ~4x faster than 10 on serverless.
    bcrypt.hash(password, 8).then((hashedPassword) => {
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }).catch(() => {});
    }).catch(() => {});
  }

  if (!passwordMatch) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  if (user.status !== "APPROVED") {
    return NextResponse.json(
      { ok: false, error: `Account status: ${user.status}. Please wait for admin approval.` },
      { status: 403 }
    );
  }

  // Create response and set cookie immediately
  const response = NextResponse.json({ ok: true, role: user.role });
  
  response.cookies.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  return response;
}
