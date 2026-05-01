import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const { userId } = body;

    if (typeof userId !== "string") {
        return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (userId === currentUser.id) {
        return NextResponse.json({ ok: false, error: "Cannot delete yourself" }, { status: 400 });
    }

    // Fetch the target user to check their super admin status
    const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, isSuperAdmin: true, role: true },
    });

    if (!targetUser) {
        return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    // Nobody can delete the super admin
    if (targetUser.isSuperAdmin) {
        return NextResponse.json({ ok: false, error: "The Super Admin account cannot be deleted" }, { status: 403 });
    }

    // Only the super admin can delete other admins
    if (targetUser.role === "admin" && !currentUser.isSuperAdmin) {
        return NextResponse.json({ ok: false, error: "Only the Super Admin can delete admin accounts" }, { status: 403 });
    }

    try {
        await prisma.user.delete({
            where: { id: userId },
        });
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json({ ok: false, error: "Failed to delete user" }, { status: 500 });
    }
}
