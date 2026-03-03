import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
        return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    // Get user with password
    const userWithPassword = await prisma.user.findUnique({
        where: { id: user.id },
        select: { password: true }
    });

    if (!userWithPassword) {
        return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!passwordMatch) {
        return NextResponse.json({ ok: false, error: "Incorrect current password" }, { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword }
    });

    return NextResponse.json({ ok: true });
}
