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
    <html lang="en" data-theme="skillsync">
      <body className={`${inter.className} ${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster
          position="top-center"
          gutter={12}
          toastOptions={{
            // --- CORE STYLES (Unchanged) ---
            className:
              "font-semibold rounded-full shadow-lg flex items-center gap-2 px-4 py-2 border", // Added a border for definition

            // --- SUCCESS TOAST (THE FIX) ---
            success: {
              icon: <FiCheckCircle size={20} />,
              style: {
                color: "#00fb7f", // Your vibrant primary green text
                background: "#0d3c23", // A solid, deep green background
                borderColor: "#00fb7f30", // A subtle border using the primary color
              },
            },

            // --- ERROR TOAST (THE FIX) ---
            error: {
              icon: <FiXCircle size={20} />,
              style: {
                color: "#ff6266", // Your vibrant error red text
                background: "#4d1d1f", // A solid, deep red background
                borderColor: "#ff626630", // A subtle border using the error color
              },
            },

            // --- LOADING TOAST (THE FIX) ---
            loading: {
              icon: <FiLoader size={20} className="animate-spin" />,
              style: {
                color: "#fcb700", // Your vibrant warning yellow text
                background: "#4a3700", // A solid, deep yellow/gold background
                borderColor: "#fcb70030", // A subtle border using the warning color
              },
            },
          }}
        />
      </body>
    </html>
  );
}
