import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { avatarUrl } = body;

        if (!avatarUrl) {
            return NextResponse.json({ ok: false, error: "No avatar URL provided" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { avatarUrl },
        });

        return NextResponse.json({ ok: true, message: "Avatar updated successfully" });
    } catch (error) {
        console.error("Error updating avatar:", error);
        return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
    }
}
