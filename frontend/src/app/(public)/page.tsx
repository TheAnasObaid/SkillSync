import Benefits from "@/components/Home/Benefits";
import CTA from "@/components/Home/CTA";
import FounderQuote from "@/components/Home/FouderQuote";
import Hero from "@/components/Home/Hero";
import Workflow from "@/components/Home/Workflow";

export default function Home() {
  return (
    <div className="bg-base-100 text-base-content font-sans grid">
      <main className="px-4 py-16">
        {/* <Hero />
        <Benefits />
        <Workflow />
        <FounderQuote /> */}
        <CTA />
      </main>
    </div>
  );
}
