import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const trainings = await prisma.training.findMany({
    where: user.role === "admin" ? {} : {
      OR: [
        { status: "APPROVED" },
        { createdById: user.id }
      ]
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ trainings });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  const title = body?.title;
  const dateRaw = body?.date;
  const venue = body?.venue;
  const trainer = body?.trainer;
  const description = body?.description;
  const startTime = body?.startTime || "09:00 AM";
  const endTime = body?.endTime || "05:00 PM";
  const trainingType = body?.trainingType || "Training Report";
  const reportData = body?.reportData ?? null;

  if (
    typeof title !== "string" ||
    typeof dateRaw !== "string" ||
    typeof venue !== "string" ||
    typeof trainer !== "string" ||
    typeof description !== "string"
  ) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const date = new Date(dateRaw);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ ok: false, error: "Invalid date" }, { status: 400 });
  }

  const status = user.role === "admin" ? "APPROVED" : "PENDING";

  // Create training with all fields in one go using standard Prisma
  const training = await prisma.training.create({
    data: {
      title,
      date,
      venue,
      trainer,
      description,
      status,
      startTime,
      endTime,
      trainingType,
      reportData: reportData ? (typeof reportData === "string" ? reportData : JSON.stringify(reportData)) : null,
      createdById: user.id,
    },
  });

  return NextResponse.json({ ok: true, training }, { status: 201 });
}

