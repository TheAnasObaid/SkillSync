import ChallengeList from "@/components/Challenge/ChallengeList";
import Benefits from "@/components/Home/Benefits";
import CTA from "@/components/Home/CTA";
import FounderQuote from "@/components/Home/FouderQuote";
import Hero from "@/components/Home/Hero";
import Workflow from "@/components/Home/Workflow";

export default function Home() {
  return (
    <div className="bg-base-100 text-base-content font-sans">
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* <Hero /> */}
        {/* <Benefits /> */}
        <section id="challenges" className="py-12 md:py-20">
          <h2 className="text-3xl text-center font-bold mb-8">
            Open Challenges
          </h2>
          <ChallengeList />
        </section>
        {/* <Workflow />
        <FounderQuote />
        <CTA /> */}
      </main>
    </div>
  );
}
