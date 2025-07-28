import Footer from "@/components/Layout/Footer";
import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiClock } from "react-icons/fi";

const ChallengePreview = () => (
  <div className="card bg-base-200/50 shadow-lg border border-base-300 text-left">
    <div className="card-body">
      <h3 className="font-semibold text-base-content/70">Featured Challenge</h3>
      <p className="text-xl font-bold">Build a Real-time Chat App</p>
      <p className="text-sm text-base-content/60">
        Using React, TypeScript, and Socket.IO. The app should handle multiple
        rooms and user authentication.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="badge badge-outline">React</div>
        <div className="badge badge-outline">TypeScript</div>
        <div className="badge badge-outline">Sockets</div>
      </div>
      <div className="card-actions justify-between items-center mt-6">
        <span className="text-2xl font-bold text-primary">$2,500 Prize</span>
        <button className="btn btn-outline btn-primary btn-sm">
          View Details
        </button>
      </div>
    </div>
  </div>
);

const SubmissionPreview = () => (
  <div className="card bg-base-200/50 shadow-lg border border-base-300 text-left">
    <div className="card-body">
      <h3 className="font-semibold text-base-content/70">
        Incoming Submissions
      </h3>
      <div className="tabs tabs-bordered mt-2">
        <a className="tab tab-bordered tab-active">Pending (2)</a>
        <a className="tab tab-bordered">Reviewed (5)</a>
      </div>
      <div className="space-y-3 mt-4">
        <div className="p-3 bg-primary/10 border border-primary/50 rounded-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="text-primary text-xl" />
            <div>
              <p className="font-bold">Jane Doe</p>
              <span className="font-mono text-sm text-primary">
                jane-doe-submission
              </span>
            </div>
          </div>
          <span className="badge badge-success badge-sm font-bold">Winner</span>
        </div>
        <div className="p-3 bg-base-300/50 rounded-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FiClock className="text-warning text-xl" />
            <div>
              <p className="font-bold">John Smith</p>
              <span className="font-mono text-sm text-base-content/60">
                john-smith-final
              </span>
            </div>
          </div>
          <span className="badge badge-ghost badge-sm">...</span>
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans">
      <main className="container mx-auto px-4 py-16">
        <section className="grid md:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Build your <span className="text-primary"></span>
              <br />
              we can take care of the rest.
            </h1>
            <p className="text-lg text-base-content/70 max-w-lg mx-auto md:mx-0">
              An AI solution to help your DevOps team to develop faster, better,
              cleaner, more efficient code.
            </p>
            <Link href="/register" className="btn btn-primary btn-lg">
              Start Creating <FiArrowRight />
            </Link>
          </div>
          <div className="space-y-6">
            <SubmissionPreview />
            <ChallengePreview />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
