import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


export async function GET() {
  const trainings = await prisma.training.findMany({
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

  if (
    typeof title !== "string" ||
    typeof dateRaw !== "string" ||
    typeof venue !== "string" ||
    typeof trainer !== "string" ||
    typeof description !== "string" ||
    typeof startTime !== "string"
  ) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const date = new Date(dateRaw);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ ok: false, error: "Invalid date" }, { status: 400 });
  }

  const status = user.role === "admin" ? "APPROVED" : "PENDING";

  // 1. Create with known fields
  const training = await prisma.training.create({
    data: {
      title,
      date,
      venue,
      trainer,
      description,
      status,
      createdById: user.id,
    },
  });

  // 2. Set startTime with Raw SQL to bypass client-side validation
  if (startTime) {
    await (prisma as any).$executeRawUnsafe(
      `UPDATE Training SET startTime = ? WHERE id = ?`,
      startTime,
      training.id
    );
    (training as any).startTime = startTime;
  }


  return NextResponse.json({ ok: true, training }, { status: 201 });
}

