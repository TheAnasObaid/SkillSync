import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AccountStatus, Role, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthOptions, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

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

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Missing credentials");
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) throw new Error("Invalid credentials");
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid credentials");
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = user as User;
        token.id = dbUser.id;
        token.role = dbUser.role;
        token.accountStatus = dbUser.accountStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.accountStatus = token.accountStatus;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
