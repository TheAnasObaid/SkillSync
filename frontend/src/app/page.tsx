import ChallengePreview from "@/components/Home/ChallengePreview";
import FounderQuote from "@/components/Home/FouderQuote";
import SubmissionPreview from "@/components/Home/SubmissionPreview";
import { Space_Mono } from "next/font/google";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCode,
  FiFilePlus,
  FiStar,
  FiXCircle,
} from "react-icons/fi";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export default function Home() {
  return (
    <div className="bg-base-100 text-base-content font-sans">
      <main className="max-w-6xl mx-auto px-4 py-16">
        <section className="grid md:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <div className="space-y-6 text-center md:text-left">
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
            <Link href="/register" className="btn btn-primary">
              Start Creating <FiArrowRight />
            </Link>
          </div>
          <div className="space-y-6">
            <SubmissionPreview />
            <ChallengePreview />
          </div>
        </section>
        <div className="divider my-20"></div>

        <section className="py-20 max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-4xl font-bold">
              Stop Guessing. Start Building.
            </h2>
            <p className="text-lg text-base-content/70">
              Traditional hiring is broken. We replace ambiguity with tangible
              results.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="space-y-4 p-6 bg-base-200/50 border border-base-300 rounded-lg">
              <h3 className="font-bold text-xl text-error flex items-center gap-2">
                <FiXCircle /> The Old Way
              </h3>
              <ul className="space-y-2 list-inside text-base-content/70">
                <li>Hours spent sifting through résumés.</li>
                <li>Uncertain technical skills and "talkers" vs. "doers".</li>
                <li>Lengthy, expensive interview cycles.</li>
                <li>Projects stalling due to a bad hire.</li>
              </ul>
            </div>
            <div className="space-y-4 p-6 bg-primary/10 border border-primary/50 rounded-lg">
              <h3 className="font-bold text-xl text-primary flex items-center gap-2">
                <FiCheckCircle /> The SkillSync Way
              </h3>
              <ul className="space-y-2 list-inside text-base-content/90">
                <li>Code speaks louder than words.</li>
                <li>See real-world problem-solving in action.</li>
                <li>Vet talent based on actual, relevant work.</li>
                <li>
                  Reward the best solution and move forward with confidence.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="divider my-20"></div>

        <section className="py-20 text-center max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-4xl font-bold">A Simple, Powerful Workflow</h2>
            <p className="text-lg text-base-content/70">
              Get from idea to execution in three clear steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 space-y-4 group">
              <div className="p-4 bg-primary/10 rounded-full transition-transform group-hover:scale-110">
                <FiFilePlus className="text-primary text-4xl" />
              </div>
              <h3 className="text-2xl font-bold">1. Post a Challenge</h3>
              <p className="text-base-content/70">
                Clients define a real-world problem, set the requirements, and
                offer a prize.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 space-y-4 group">
              <div className="p-4 bg-primary/10 rounded-full transition-transform group-hover:scale-110">
                <FiCode className="text-primary text-4xl" />
              </div>
              <h3 className="text-2xl font-bold">2. Compete & Submit</h3>
              <p className="text-base-content/70">
                Top developers from around the world compete to build the best
                solution.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 space-y-4 group">
              <div className="p-4 bg-primary/10 rounded-full transition-transform group-hover:scale-110">
                <FiStar className="text-primary text-4xl" />
              </div>
              <h3 className="text-2xl font-bold">3. Review & Reward</h3>
              <p className="text-base-content/70">
                Clients review the submissions, provide feedback, and reward the
                winning developer.
              </p>
            </div>
          </div>
        </section>

        <FounderQuote />

        <section className="py-32 text-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold">Ready to Redefine Talent?</h2>
            <p className="text-lg text-base-content/70 max-w-xl mx-auto">
              Join the platform that values skill above all else. Whether you're
              looking to hire or prove your talent, your journey starts here.
            </p>
            <Link href="/register" className="btn btn-primary">
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-base-content/50">
        <p>© 2025 SkillSync. All rights reserved.</p>
      </footer>
    </div>
  );
}
