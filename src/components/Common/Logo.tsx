import { Space_Mono } from "next/font/google";
import Link from "next/link";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const Logo = () => {
  return (
    <Link href="/" className={`${spaceMono.className} font-bold text-xl`}>
      Skill<span className="text-primary">Sync</span>
    </Link>
  );
};

export default Logo;
