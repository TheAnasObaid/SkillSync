import {
  FiAward,
  FiCheck,
  FiClock,
  FiCode,
  FiThumbsDown,
  FiXCircle,
  FiZap,
} from "react-icons/fi";

const BenefitItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <li className="flex items-start gap-3">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <span>{text}</span>
  </li>
);

const Benefits = () => {
  return (
    <section className="py-20 max-w-5xl mx-auto">
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-4xl font-bold tracking-tight">
          Stop Guessing. Start Building.
        </h2>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Traditional hiring is slow, biased, and inefficient. We replace
          ambiguity with tangible results from day one.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 text-left">
        <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all duration-300">
          <div className="card-body">
            <h3 className="card-title text-error/80 flex items-center gap-2">
              <FiXCircle /> The Old Way
            </h3>
            <div className="divider mt-2 mb-4"></div>
            <ul className="space-y-4 text-base-content/70">
              <BenefitItem
                icon={<FiThumbsDown className="text-error/60" />}
                text="Hiring based on résumés and claims, not proven skill."
              />
              <BenefitItem
                icon={<FiClock className="text-error/60" />}
                text="Lengthy, expensive interview cycles that stall projects."
              />
              <BenefitItem
                icon={<FiCode className="text-error/60" />}
                text="Onboarding a new hire only to discover a technical mismatch."
              />
            </ul>
          </div>
        </div>

        <div className="card bg-base-200/50 border border-base-300 shadow-lg transition-all duration-300 hover:border-primary hover:shadow-primary/20 hover:-translate-y-2">
          <div className="card-body">
            <h3 className="card-title text-primary flex items-center gap-2">
              <FiZap /> The SkillSync Way
            </h3>
            <div className="divider mt-2 mb-4"></div>
            <ul className="space-y-4 text-base-content/90 font-medium">
              <BenefitItem
                icon={<FiCheck className="text-primary" />}
                text="Code speaks louder. Vet talent based on actual work."
              />
              <BenefitItem
                icon={<FiAward className="text-primary" />}
                text="Reward the best solution and move forward with confidence."
              />
              <BenefitItem
                icon={<FiCode className="text-primary" />}
                text="Integrate winning developers who already understand the problem."
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
