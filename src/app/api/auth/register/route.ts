import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    const username = body?.username;
    const email = body?.email;
    const password = body?.password;

    if (typeof username !== "string" || typeof password !== "string" || typeof email !== "string") {
        return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    // Check if user or email already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username },
                { email }
            ]
        },
    });

    if (existingUser) {
        if (existingUser.username === username) {
            return NextResponse.json({ ok: false, error: "Username already taken" }, { status: 400 });
        }
        return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user (Role: staff, Status: PENDING)
    await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            role: "staff",
            status: "PENDING",
        },
    });

    return NextResponse.json({ ok: true });
}
