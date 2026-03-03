import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const { trainingId, status } = body;

    if (!trainingId || !["APPROVED", "REJECTED"].includes(status)) {
        return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    await prisma.training.update({
        where: { id: trainingId },
        data: { status },
    });

    return NextResponse.json({ ok: true });
}
