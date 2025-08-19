import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";

const updateProfileSchema = z
  .object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().optional(),
    bio: z.string().optional(),
    companyName: z.string().optional(),
    skills: z.array(z.string()).optional(),
    experience: z.string().optional(),
  })
  .strict();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        portfolio: {
          orderBy: { createdAt: "desc" },
        },
        submissions: {
          orderBy: { createdAt: "desc" },
          include: {
            challenge: {
              select: { id: true, title: true, prize: true, status: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("GET /api/users/me Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("PUT /api/users/me Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data provided.", issues: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
