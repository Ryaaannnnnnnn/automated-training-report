import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);

    if (!body) {
        return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
    }

    const { username, designation, role, password } = body;

    // Validate role
    if (role && !["admin", "staff"].includes(role)) {
        return NextResponse.json({ ok: false, error: "Invalid role" }, { status: 400 });
    }

    // Validate username
    if (username && (typeof username !== "string" || username.trim().length < 1)) {
        return NextResponse.json({ ok: false, error: "Username cannot be empty" }, { status: 400 });
    }

    // Check if username is already taken by another user
    if (username) {
        const existing = await prisma.user.findFirst({
            where: { username: username.trim(), NOT: { id } },
        });
        if (existing) {
            return NextResponse.json({ ok: false, error: "Username is already taken" }, { status: 409 });
        }
    }

    // Validate password if provided
    if (password !== undefined && password !== "") {
        if (typeof password !== "string" || password.length < 6) {
            return NextResponse.json({ ok: false, error: "Password must be at least 6 characters" }, { status: 400 });
        }
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (username) updateData.username = username.trim();
    if (designation !== undefined) updateData.designation = designation.trim();
    if (role) updateData.role = role;
    if (password && password.length >= 6) {
        updateData.password = await bcrypt.hash(password, 12);
    }

    const updated = await prisma.user.update({
        where: { id },
        data: updateData,
        select: { id: true, username: true, designation: true, role: true },
    });

    return NextResponse.json({ ok: true, user: updated });
}
