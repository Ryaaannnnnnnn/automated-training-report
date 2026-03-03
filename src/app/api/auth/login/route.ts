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

  // Try bcrypt compare first (new hashed passwords)
  let passwordMatch = await bcrypt.compare(password, user.password).catch(() => false);

  // Lazy migration: if bcrypt fails, try plain-text (old passwords) and upgrade
  if (!passwordMatch && user.password === password) {
    passwordMatch = true;
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
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

  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set({
    name: "session",
    value: user.id,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
