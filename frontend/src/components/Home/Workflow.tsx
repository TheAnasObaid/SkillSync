import { FiCode, FiFilePlus, FiStar } from "react-icons/fi";

const Workflow = () => {
  return (
    <section className="py-20 text-center max-w-6xl mx-auto border-b border-base-300/100">
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
            Clients define a real-world problem, set the requirements, and offer
            a prize.
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
  );
};

export default Workflow;
