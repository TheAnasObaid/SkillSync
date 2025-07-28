import Benefits from "@/components/Home/Benefits";
import CTA from "@/components/Home/CTA";
import FounderQuote from "@/components/Home/FouderQuote";
import Hero from "@/components/Home/Hero";
import Workflow from "@/components/Home/Workflow";
import Link from "next/link";
import {
  FiCheckCircle,
  FiCode,
  FiFilePlus,
  FiStar,
  FiXCircle,
} from "react-icons/fi";

export default function Home() {
  return (
    <div className="bg-base-100 text-base-content font-sans">
      <main className="max-w-6xl mx-auto px-4 py-16">
        <Hero />
        <Benefits />
        <Workflow />
        <FounderQuote />
        <CTA />
      </main>
    </div>
  );
}
