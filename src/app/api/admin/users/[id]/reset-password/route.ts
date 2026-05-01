import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);
    const password = body?.password;

    if (typeof password !== "string" || password.length < 1) {
        return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
        return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    if (targetUser.id === currentUser.id) {
        return NextResponse.json({ ok: false, error: "Cannot reset your own password here. Use profile settings." }, { status: 400 });
    }

    if (targetUser.role === "admin" && !currentUser.isSuperAdmin) {
        return NextResponse.json({ ok: false, error: "Only the Super Admin can reset the password of an administrator." }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
    });

    return NextResponse.json({ ok: true });
}
