import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();

        // Security check: Only admins can delete
        if (!user || user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { trainingId } = await request.json();

        if (!trainingId) {
            return new NextResponse("Training ID is required", { status: 400 });
        }

        // Deleting the training. Attendances and Evaluations will be deleted automatically 
        // because of `onDelete: Cascade` in the schema.
        await prisma.training.delete({
            where: { id: trainingId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[TRAINING_DELETE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
