import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@prisma/client";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session;
}

export async function getCurrentUserObject(): Promise<User | null> {
  const session = await getCurrentUser();
  if (!session?.user?.id) return null;
  const user = await prisma!.user.findUnique({
    where: { id: session.user.id },
  });
  return user;
}
