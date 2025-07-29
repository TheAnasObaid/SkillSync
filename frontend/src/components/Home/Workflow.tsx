import { FiArrowRight, FiCode, FiFilePlus, FiStar } from "react-icons/fi";

const Workflow = () => {
  return (
    <section className="py-20 text-center max-w-6xl mx-auto">
      <div className="space-y-3 mb-16">
        <h2 className="text-4xl font-bold tracking-tight">
          A Simple, Powerful Workflow
        </h2>
        <p className="text-lg text-base-content/70">
          From idea to execution in three clear steps.
        </p>
      </div>

      {/* 
        We use a flex container to easily place the arrows between cards.
        It stacks vertically on mobile and becomes a row on medium screens and up.
      */}
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-8">
        {/* --- Step 1 Card --- */}
        <div
          className="card bg-base-200/50 border border-base-300 shadow-md transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 relative opacity-0 [animation:fade-in-up_0.6s_ease-out_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="absolute top-0 right-4 text-8xl font-black text-base-content/5 z-0">
            1
          </div>
          <div className="card-body items-center text-center z-10">
            <div className="p-4 bg-primary/10 rounded-full">
              <FiFilePlus className="text-primary text-4xl" />
            </div>
            <h3 className="card-title mt-4">Post a Challenge</h3>
            <p className="text-base-content/70">
              Clients define a real-world problem, set requirements, and offer a
              prize for the best solution.
            </p>
          </div>
        </div>

        {/* --- Connector Arrow 1 (visible on desktop) --- */}
        <div className="hidden md:flex items-center text-base-content/30">
          <FiArrowRight size={32} />
        </div>

        {/* --- Step 2 Card --- */}
        <div
          className="card bg-base-200/50 border border-base-300 shadow-md transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 relative opacity-0 [animation:fade-in-up_0.6s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="absolute top-0 right-4 text-8xl font-black text-base-content/5 z-0">
            2
          </div>
          <div className="card-body items-center text-center z-10">
            <div className="p-4 bg-primary/10 rounded-full">
              <FiCode className="text-primary text-4xl" />
            </div>
            <h3 className="card-title mt-4">Compete & Submit</h3>
            <p className="text-base-content/70">
              Top developers from around the world compete to build and submit
              their innovative solutions.
            </p>
          </div>
        </div>

        {/* --- Connector Arrow 2 (visible on desktop) --- */}
        <div className="hidden md:flex items-center text-base-content/30">
          <FiArrowRight size={32} />
        </div>

        {/* --- Step 3 Card --- */}
        <div
          className="card bg-base-200/50 border border-base-300 shadow-md transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 relative opacity-0 [animation:fade-in-up_0.6s_ease-out_forwards]"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="absolute top-0 right-4 text-8xl font-black text-base-content/5 z-0">
            3
          </div>
          <div className="card-body items-center text-center z-10">
            <div className="p-4 bg-primary/10 rounded-full">
              <FiStar className="text-primary text-4xl" />
            </div>
            <h3 className="card-title mt-4">Review & Reward</h3>
            <p className="text-base-content/70">
              Clients review the submissions, provide valuable feedback, and
              reward the winning developer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
