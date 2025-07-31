import AuthLayout from "@/components/Layout/AuthLayout";
import { SocketProvider } from "@/context/SocketContext";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "SkillSync: You can and you win",
  description:
    "A competitive platform where businesses meet right developers to deliver the best solutions. It's where talent is proven, not just promised.",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="skillsync-pro">
      <body className={`${inter.className} ${inter.variable} antialiased`}>
        <SocketProvider>
          <AuthLayout>{children}</AuthLayout>
        </SocketProvider>
      </body>
    </html>
  );
}
