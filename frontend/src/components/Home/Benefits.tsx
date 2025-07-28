import { FiXCircle, FiCheckCircle } from "react-icons/fi";

const Benefits = () => {
  return (
    <section className="py-20 max-w-5xl mx-auto border-b border-base-300/100">
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-4xl font-bold">Stop Guessing. Start Building.</h2>
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
            <li>Reward the best solution and move forward with confidence.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
