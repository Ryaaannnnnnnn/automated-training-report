import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const training = await prisma.training.findUnique({
        where: { id }
    });

    if (!training) {
        return NextResponse.json({ ok: false, error: "Training not found" }, { status: 404 });
    }

    // Visibility Check
    if (user.role !== "admin" && training.status !== "APPROVED" && training.createdById !== user.id) {
        return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
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
        const endTime = body?.endTime;
        const status = body?.status;
        const trainingType = body?.trainingType;
        const reportData = body?.reportData;

        if (
            typeof title !== "string" ||
            typeof dateRaw !== "string" ||
            typeof venue !== "string" ||
            typeof trainer !== "string" ||
            typeof description !== "string" ||
            (startTime !== undefined && typeof startTime !== "string") ||
            (status !== undefined && !["PENDING", "APPROVED", "REJECTED"].includes(status)) ||
            (reportData !== undefined && typeof reportData !== "string")
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

        // ONLY the creator or an Admin can edit
        if (existingTraining.createdById !== user.id && user.role !== "admin") {
            return NextResponse.json({ ok: false, error: "Forbidden: Only the creator or an Admin can edit this training" }, { status: 403 });
        }

        // 1. Update with standard Prisma
        const updatedTraining = await prisma.training.update({
            where: { id },
            data: {
                title,
                date,
                venue,
                trainer,
                description,
                status: status as any,
                startTime: startTime !== undefined ? startTime : undefined,
                endTime: endTime !== undefined ? endTime : undefined,
                trainingType: trainingType !== undefined ? trainingType : undefined,
                reportData: reportData !== undefined ? reportData : undefined,
            },
        });

        return NextResponse.json({ ok: true, training: updatedTraining });
    } catch (error) {
        console.error("[TRAINING_PATCH_ERROR]", error);
        return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Fetch existing training to check ownership/permissions
        const existingTraining = await prisma.training.findUnique({
            where: { id },
        });

        if (!existingTraining) {
            return NextResponse.json({ ok: false, error: "Training not found" }, { status: 404 });
        }

        // ONLY the creator or an Admin can delete
        if (existingTraining.createdById !== user.id && user.role !== "admin") {
            return NextResponse.json({ ok: false, error: "Forbidden: Only the creator or an Admin can delete this training" }, { status: 403 });
        }

        await prisma.training.delete({
            where: { id },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("[TRAINING_DELETE_ERROR]", error);
        return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
    }
}
