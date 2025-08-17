import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ itemId: string }>;
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const { itemId } = await params;

    // Prisma's delete operation will fail if the item doesn't exist
    // or if the userId doesn't match, providing a layer of security.
    await prisma.portfolioItem.delete({
      where: {
        id: itemId,
        userId: session.user.id, // Security check: ensure the user owns this item
      },
    });

    return NextResponse.json({ message: "Portfolio item deleted." });
  } catch (error) {
    console.error("DELETE /api/users/me/portfolio/[itemId] Error:", error);
    // Prisma throws a specific error if the record to delete is not found
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
