import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { FiCheckCircle, FiLoader, FiXCircle } from "react-icons/fi";
import Providers from "./Providers";

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
        <Providers>{children}</Providers>
        <Toaster
          position="top-center"
          gutter={12}
          toastOptions={{
            className:
              "font-semibold rounded-full shadow-lg flex items-center gap-2 px-4 py-2 border",

            success: {
              icon: <FiCheckCircle size={20} />,
              style: {
                color: "#00fb7f",
                background: "#0d3c23",
                borderColor: "#00fb7f30",
              },
            },

            error: {
              icon: <FiXCircle size={20} />,
              style: {
                color: "#ff6266",
                background: "#4d1d1f",
                borderColor: "#ff626630",
              },
            },

            loading: {
              icon: <FiLoader size={20} className="animate-spin" />,
              style: {
                color: "#fcb700",
                background: "#4a3700",
                borderColor: "#fcb70030",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
