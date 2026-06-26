import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await prisma.$transaction(async (tx) => {
      return await tx.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          passwordHash: true,
        },
      });
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }
    const passwordValid = await compare(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }
    const token = sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.name,
        last_name: "",
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    // Explicitly disconnect in development
    if (process.env.NODE_ENV === "development") {
      await prisma.$disconnect();
    }
  }
}
