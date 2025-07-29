import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const CTA = () => {
  return (
    // The main container is now relative to position the background gradient
    <section className="relative overflow-hidden py-32 text-center">
      {/* 
        This is the decorative background glow. It uses a radial gradient
        to create a spotlight effect, making the section feel more dynamic.
      */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] z-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, oklch(var(--p)/.10), transparent 80%)",
        }}
      />

      {/* The content is on a higher z-index to sit above the glow */}
      <div className="relative z-10 space-y-6 max-w-2xl mx-auto px-4">
        <h2 className="text-5xl font-bold tracking-tight">
          Ready to Redefine Talent?
        </h2>
        <p className="text-lg text-base-content/70">
          Join the platform that values skill above all else. Whether you're
          looking to hire or prove your talent, your journey starts here.
        </p>
        <div className="pt-4">
          <Link
            href="/register"
            className="btn btn-primary btn-lg shadow-lg shadow-primary/20"
          >
            Get Started for Free <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
