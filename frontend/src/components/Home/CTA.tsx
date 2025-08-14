import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const CTA = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-4">
        <div
          className="card bg-base-200/50 border border-base-300 shadow-xl"
          style={{
            backgroundImage: `
              linear-gradient(oklch(var(--b3)/.1) 1px, transparent 1px),
              linear-gradient(to right, oklch(var(--b3)/.1) 1px, transparent 1px)
            `,
            backgroundSize: "2rem 2rem",
          }}
        >
          <div className="card-body items-center text-center p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Ready to Redefine Talent?
            </h2>
            <p className="text-lg text-base-content/70 mt-4 max-w-xl mx-auto">
              Join the platform that values skill above all else. Whether you're
              looking to hire or prove your talent, your journey starts here.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="btn btn-primary btn-lg shadow-lg shadow-primary/20"
              >
                Get Started for Free <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
