import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const { userId } = body;

    if (typeof userId !== "string") {
        return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (userId === user.id) {
        return NextResponse.json({ ok: false, error: "Cannot delete yourself" }, { status: 400 });
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
