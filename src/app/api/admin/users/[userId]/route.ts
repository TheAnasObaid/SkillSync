import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { AccountStatus, Role } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { z } from "zod";

const adminUserUpdateSchema = z
  .object({
    role: z.enum(Object.values(Role) as [string, ...string[]]).optional(),
    accountStatus: z.enum(AccountStatus).optional(),
    setVerified: z.boolean().optional(),
  })
  .strict();

interface Params {
  params: Promise<{ userId: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { userId } = await params;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json(
        { message: "Forbidden: Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = adminUserUpdateSchema.safeParse(body);

    if (session.user.id === userId) {
      return NextResponse.json(
        { message: "Admins cannot modify their own role or status." },
        { status: 400 }
      );
    }

    if (!parseResult.success) {
      return NextResponse.json(
        {
          message: "Invalid update data provided.",
          issues: parseResult.error.issues,
        },
        { status: 400 }
      );
    }
    const { setVerified, ...validatedData } = parseResult.data;

    if (session.user.id === userId) {
      return NextResponse.json(
        { message: "Admins cannot modify their own role or status." },
        { status: 400 }
      );
    }

    const dataToUpdate: any = { ...validatedData };
    if (typeof setVerified === "boolean") {
      dataToUpdate.emailVerified = setVerified ? new Date() : null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error(`ADMIN PATCH /api/admin/users/${userId} Error:`, error);

    if (error.code === "P2025") {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
