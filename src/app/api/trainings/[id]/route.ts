import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const trainings = await (prisma as any).$queryRawUnsafe(
        "SELECT * FROM Training WHERE id = ?",
        id
    );
    const training = (trainings as any[])?.[0];

    if (!training) {
        return NextResponse.json({ ok: false, error: "Training not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, training });
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json().catch(() => null);

        const title = body?.title;
        const dateRaw = body?.date;
        const venue = body?.venue;
        const trainer = body?.trainer;
        const description = body?.description;
        const startTime = body?.startTime;
        const status = body?.status;

        if (
            typeof title !== "string" ||
            typeof dateRaw !== "string" ||
            typeof venue !== "string" ||
            typeof trainer !== "string" ||
            typeof description !== "string" ||
            (startTime !== undefined && typeof startTime !== "string") ||
            (status !== undefined && !["PENDING", "APPROVED", "REJECTED"].includes(status))
        ) {
            return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
        }

        const date = new Date(dateRaw);
        if (Number.isNaN(date.getTime())) {
            return NextResponse.json({ ok: false, error: "Invalid date" }, { status: 400 });
        }

        // Fetch existing training to check ownership/permissions
        const existingTraining = await prisma.training.findUnique({
            where: { id },
        });

        if (!existingTraining) {
            return NextResponse.json({ ok: false, error: "Training not found" }, { status: 404 });
        }

        // Only Admin or the creator can edit
        if (user.role !== "admin" && existingTraining.createdById !== user.id) {
            return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
        }

        // 1. Update known fields with Prisma
        const updatedTraining = await prisma.training.update({
            where: { id },
            data: {
                title,
                date,
                venue,
                trainer,
                description,
                status: status as any,
            },
        });

        // 2. Update startTime with Raw SQL to bypass client-side validation
        if (startTime !== undefined) {
            await (prisma as any).$executeRawUnsafe(
                `UPDATE Training SET startTime = ? WHERE id = ?`,
                startTime,
                id
            );
            // Refresh updatedTraining object to include the new startTime for the response
            (updatedTraining as any).startTime = startTime;
        }

        return NextResponse.json({ ok: true, training: updatedTraining });
    } catch (error) {
        console.error("[TRAINING_PATCH_ERROR]", error);
        return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
    }
}
