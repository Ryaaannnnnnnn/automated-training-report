import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const training = await prisma.training.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: {
                        username: true,
                        role: true,
                    },
                },
                attendances: {
                    include: {
                        participant: true,
                    },
                    orderBy: {
                        participant: {
                            name: "asc",
                        },
                    },
                },
                evaluations: {
                    include: {
                        participant: true,
                    },
                    orderBy: {
                        participant: {
                            name: "asc",
                        },
                    },
                },
            },
        });

        if (!training) {
            return NextResponse.json({ ok: false, error: "Training not found" }, { status: 404 });
        }

        return NextResponse.json({ ok: true, training });
    } catch (error) {
        console.error("[TRAINING_REPORT_GET_ERROR]", error);
        return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
    }
}
