import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const adminUserUpdateSchema = z
  .object({
    role: z.enum(Role).optional(),
    accountStatus: z.enum(["ACTIVE", "BANNED"]).optional(),
    isVerified: z.boolean().optional(),
  })
  .strict(); // .strict() ensures no other properties can be passed

interface Params {
  params: Promise<{ userId: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { userId } = await params;

  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { message: "Forbidden: Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedBody = adminUserUpdateSchema.parse(body);

    if (session.user.id === userId) {
      return NextResponse.json(
        { message: "Admins cannot modify their own role or status." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedBody,
    });

    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error(`ADMIN PATCH /api/admin/users/${userId} Error:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid update data provided.", issues: error.issues },
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
