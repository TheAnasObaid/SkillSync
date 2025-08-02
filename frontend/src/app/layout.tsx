import { SocketProvider } from "@/context/SocketContext";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

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
        <Toaster
          position="top-center"
          gutter={12}
          toastOptions={{
            className:
              "font-semibold rounded-full shadow-lg flex items-center gap-2 px-4 py-2",
            success: {
              icon: <FiCheckCircle size={20} />,
              style: {
                color: "#00fb7f",
                background: "#00fb7f1a",
              },
            },
            error: {
              style: {
                color: "#ff6266",
                background: "#ff62661a",
              },
              icon: <FiXCircle size={20} />,
            },
            loading: {
              style: {
                color: "#fcb700",
                background: "#fcb7001a",
              },
              icon: <FiLoader size={20} className="animate-spin" />,
            },
          }}
        />
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
