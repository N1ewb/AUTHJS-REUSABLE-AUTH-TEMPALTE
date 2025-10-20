import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Use a transaction to ensure connection is properly handled
    const user = await prisma.$transaction(async (tx) => {
      return await tx.user.findUnique({
        where: { email },
        select: {
          user_id: true,
          email: true,
          first_name: true,
          last_name: true,
          role: true,
          password: true,
        },
      });
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = sign(
      {
        id: user.user_id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);

    // Add more detailed error logging
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    // Explicitly disconnect in development
    if (process.env.NODE_ENV === "development") {
      await prisma.$disconnect();
    }
  }
}
