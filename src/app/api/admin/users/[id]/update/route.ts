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

    // Fetch the target user to check protection status
    const targetUser = await prisma.user.findUnique({
        where: { id },
        select: { id: true, isSuperAdmin: true, role: true },
    });

    if (!targetUser) {
        return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    // Nobody can modify the super admin (except the super admin themselves)
    if (targetUser.isSuperAdmin && currentUser.id !== targetUser.id) {
        return NextResponse.json({ ok: false, error: "The Super Admin account cannot be modified by other admins" }, { status: 403 });
    }

    // Only the super admin can edit other admin accounts
    if (targetUser.role === "admin" && !currentUser.isSuperAdmin && currentUser.id !== targetUser.id) {
        return NextResponse.json({ ok: false, error: "Only the Super Admin can edit admin accounts" }, { status: 403 });
    }

    const { username, designation, role, password } = body;

    // Prevent isSuperAdmin from being changed via this endpoint
    if ("isSuperAdmin" in body) {
        return NextResponse.json({ ok: false, error: "Super Admin status cannot be changed via this endpoint" }, { status: 403 });
    }

    // Validate role
    if (role && !["admin", "staff"].includes(role)) {
        return NextResponse.json({ ok: false, error: "Invalid role" }, { status: 400 });
    }

    // Prevent demoting the super admin
    if (targetUser.isSuperAdmin && role === "staff") {
        return NextResponse.json({ ok: false, error: "The Super Admin role cannot be changed" }, { status: 403 });
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
