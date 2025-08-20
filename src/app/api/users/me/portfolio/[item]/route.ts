import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ itemId: string }>;
}

export async function DELETE(_: Request, { params }: Params) {
  const { itemId } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    await prisma.portfolioItem.delete({
      where: {
        id: itemId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Portfolio item deleted." });
  } catch (error) {
    console.error(`DELETE /api/users/me/portfolio/${itemId} Error:`, error);

    if ((error as any).code === "P2025") {
      return NextResponse.json(
        {
          message: "Item not found or you do not have permission to delete it.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
