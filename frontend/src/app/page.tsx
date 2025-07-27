import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import Link from "next/link";
import {
  FaTasks,
  FaCodeBranch,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-white text-black font-sans">
        {/* Hero Section */}
        <section className="text-center py-24 px-4 grid gap-5  max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold">
            Simplify Coding Collaboration
          </h1>
          <div className="flex flex-col">
            <p className="text-lg text-gray-600">
              SkillSync connects clients, developers, and admins in a unified
              platform for challenge submission and review.
            </p>
            <p className="text-lg text-secondary font-semibold w-fit mx-auto">
              Collaborate. Submit. Succeed.
            </p>
          </div>
          <Link href="/challenges" className="btn btn-secondary w-fit mx-auto">
            Explore Challenges
          </Link>
          <div className="mt-12 border rounded-xl shadow p-6">
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              Dashboard Preview
            </div>
          </div>
        </section>

        {/* Problems vs Solutions */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold">
              Developer workflows shouldn’t be chaotic.
            </h2>
            <div className="mt-10 grid md:grid-cols-2 gap-8 text-left">
              {/* Problems List */}
              <ul className="space-y-3 text-error">
                {[
                  "Unclear challenge requirements",
                  "Disorganized submissions and reviews",
                  "Manual task tracking",
                  "Lack of role-based access",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FaTimesCircle />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Solutions List */}
              <ul className="space-y-3 text-primary">
                {[
                  "Create and assign challenges with intent",
                  "Submit and track developer solutions",
                  "Streamlined review process for admins",
                  "Clean role-based workflows",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FaCheckCircle />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Role-Based Workflow */}
        <section className="py-20 px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold">One platform. Three roles.</h2>
          <p className="mt-2 text-gray-600">
            Clients post challenges, developers submit solutions, and admins
            review — all in one place.
          </p>
          <div className="mt-10 border rounded-xl shadow p-6 bg-white">
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              Role-Based Workflow UI
            </div>
          </div>
        </section>

        {/* Submission Tracking */}
        <section className="py-20 px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold">Track Every Submission</h2>
          <p className="mt-2 text-gray-600">
            Developers submit. Clients and admins review. Everything is visible,
            organized, and traceable.
          </p>
          <div className="mt-10 border rounded-xl shadow p-6 bg-white">
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              Submissions View UI
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 px-4 text-center max-w-2xl mx-auto text-gray-700">
          <blockquote className="italic">
            “SkillSync helped us manage real challenges, track developer
            progress, and streamline our workflow without any confusion.”
          </blockquote>
          <p className="mt-4 font-semibold">– Anas Obaid, Engineering Lead</p>
        </section>

        {/* Feature Highlights */}
        <section className="py-20 px-4 bg-gray-50 max-w-6xl mx-auto grid gap-6 md:grid-cols-3 text-left mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaTasks className="text-warning" />
              <h4 className="font-semibold">Post Challenges</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Let clients and admins create coding tasks with clear goals and
              requirements.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaCodeBranch className="text-accent" />
              <h4 className="font-semibold">Submit & Review</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Developers submit work while admins and clients review and respond
              in one place.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaChartLine className="text-primary" />
              <h4 className="font-semibold">Real-Time Visibility</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Know who’s working on what, what’s pending, and what’s done — at a
              glance.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="grid gap-5 items-center justify-center mb-10 text-center">
          <h2 className="text-2xl font-bold">
            Ready to streamline your developer collaboration?
          </h2>
          <Link href="/challenges" className="btn btn-secondary w-fit mx-auto">
            Get Started
          </Link>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-sm text-gray-400">
          <p>
            &copy; 2025 SkillSync. Built for seamless technical collaboration.
          </p>
        </footer>
      </main>
      <Footer />
    </>
  );
}
