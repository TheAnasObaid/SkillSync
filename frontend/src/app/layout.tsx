import { SocketProvider } from "@/context/SocketContext";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "SkillSync",
  description: "A competitive programming platform for real-world problems.",
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
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
