import Image from "next/image";
import Link from "next/link";
import { FiTarget, FiZap, FiEye } from "react-icons/fi";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 px-4 space-y-16">
      {/* --- Section 1: Our Mission --- */}
      <section className="text-center">
        <FiTarget className="mx-auto text-5xl text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Our Mission
        </h1>
        <p className="mt-4 text-lg text-base-content/80 max-w-2xl mx-auto">
          To build a world where technical hiring is based on proven skill, not
          resumes. We connect innovative companies with exceptional developers
          through objective, real-world challenges.
        </p>
      </section>

      {/* --- Section 2: Founder's Story --- */}
      <section className="card bg-base-200/50 border border-base-300 shadow-lg">
        <div className="card-body items-center text-center p-8 md:p-12">
          <div className="avatar">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
              {/* Replace with a real photo of you in the /public folder */}
              <Image
                src="/founder.png"
                alt="Anas Obaid, Founder of SkillSync"
                width={128}
                height={128}
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold mt-6">Meet the Founder</h2>
          <p className="font-semibold text-primary">
            Anas Obaid, Founder & CEO
          </p>
          <blockquote className="mt-4 text-base-content/70 max-w-xl italic">
            "As a developer, I saw brilliant peers overlooked because they
            couldn't fit their skills onto a single page. I built SkillSync to
            end the guesswork. This is a platform where businesses see real
            work, and developers prove their talent by solving real problems. No
            more noise, just results."
          </blockquote>
        </div>
      </section>

      {/* --- Section 3: Our Vision --- */}
      <section className="text-center">
        <FiEye className="mx-auto text-5xl text-primary mb-4" />
        <h2 className="text-4xl font-bold tracking-tight">
          Our Vision for the Future
        </h2>
        <p className="mt-4 text-lg text-base-content/80 max-w-2xl mx-auto">
          We're just getting started. Our roadmap includes team-based
          competitions, enterprise integrations with leading ATS platforms, and
          advanced analytics to provide companies with deeper insights into
          developer skills.
        </p>
        <Link href="/challenges" className="btn btn-primary mt-8">
          See Our Challenges in Action
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
