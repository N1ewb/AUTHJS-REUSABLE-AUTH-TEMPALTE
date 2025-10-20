import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { Prisma } from "@prisma/client";

// Configure rate limiter - adjust these values based on your needs
const rateLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 300, // Block for 5 minutes if limit is reached
});

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Check if the IP is rate limited
    try {
      await rateLimiter.consume(ip);
    } catch (rateLimiterError) {
      console.warn("Rate limit triggered for IP:", ip, rateLimiterError);
      return NextResponse.json(
        {
          user: null,
          message: "Too many signup attempts. Please try again later.",
          status: "failed",
        },
        { status: 429 } // Too Many Requests
      );
    }

    const body = await req.json();
    const { email, first_name, last_name, password } = body;

    // Validate required fields
    if (!email || !first_name || !last_name || !password) {
      return NextResponse.json(
        {
          user: null,
          message: "All fields are required",
          status: "failed",
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          user: null,
          message: "Invalid email format",
          status: "failed",
        },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        {
          user: null,
          message: "Password must be at least 8 characters long",
          status: "failed",
        },
        { status: 400 }
      );
    }

    // Use transaction to ensure data consistency and proper connection handling
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const existingUserByEmail = await tx.user.findUnique({
          where: { email },
        });

        if (existingUserByEmail) {
          throw new Error("User with this email already exists!");
        }

        const hashedPassword = await hash(password, 10);

        return await tx.user.create({
          data: {
            email,
            first_name,
            last_name,
            password: hashedPassword,
            role: "user",
          },
          select: {
            user_id: true,
            email: true,
            first_name: true,
            last_name: true,
            role: true,
          },
        });
      }
    );

    return NextResponse.json(
      {
        user: result,
        message: "User created successfully",
        status: "success",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    // Handle specific error cases
    if (
      error instanceof Error &&
      error.message === "User with this email already exists!"
    ) {
      return NextResponse.json(
        {
          user: null,
          message: error.message,
          status: "failed",
        },
        { status: 409 }
      );
    }

    // Handle general errors
    return NextResponse.json(
      {
        user: null,
        message: "An error occurred during sign up",
        status: "failed",
      },
      { status: 500 }
    );
  } finally {
    // Disconnect in development environment
    if (process.env.NODE_ENV === "development") {
      await prisma.$disconnect();
    }
  }
}
