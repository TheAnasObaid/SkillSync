import { Space_Mono } from "next/font/google";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import ChallengePreview from "./ChallengePreview";
import SubmissionPreview from "./SubmissionPreview";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const Hero = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh] border-b border-base-300/100 pb-20">
      <div className="text-center lg:text-left grid gap-7">
        <h1
          className={`${spaceMono.variable} ${spaceMono.className} text-4xl md:text-7xl font-bold leading-none`}
        >
          Solve real <span className="text-primary">&lt;</span>challenges
          <span className="text-primary">&gt;</span>
          <br />
          Find <span className="text-primary">proven talent.</span>
        </h1>
        <p className="text-lg text-base-content/70 max-w-lg mx-auto md:mx-0">
          A competitive platform where businesses meet right developers to
          deliver the best solutions. It's where talent is proven, not just
          promised.
        </p>
        <Link href="/register" className="btn btn-primary w-fit">
          Start Creating <FiArrowRight />
        </Link>
      </div>
      <div className="space-y-8">
        <ChallengePreview />
        <SubmissionPreview />
      </div>
    </section>
  );
};

export default Hero;
