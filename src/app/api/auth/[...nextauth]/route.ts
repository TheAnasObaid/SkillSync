import { authOptions } from "@//lib/authOptions";
import { AccountStatus, Role } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      accountStatus: AccountStatus;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    accountStatus: AccountStatus;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
