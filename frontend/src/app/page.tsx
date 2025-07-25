"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-5">
      <h2 className="text-4xl font-semibold">Home</h2>
      <Link href="/challenges" className="link link-hover link-secondary">
        View challenges
      </Link>
      <main className="bg-white text-black font-sans">
        {/* Hero Section */}
        <section className="text-center py-24 px-4 grid gap-5 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold">
            Make meetings worthwhile
          </h1>
          <p className="text-lg text-gray-600">
            Don't let the effort of scheduling meetings go to waste. SkillSync
            makes your coding collaboration efficient.
          </p>
          <button className="btn btn-secondary w-fit mx-auto">
            Try SkillSync for Free
          </button>
          <div className="mt-12 border rounded-xl shadow p-6">
            {/* Placeholder for dashboard mockup */}
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              Dashboard Preview
            </div>
          </div>
        </section>

        {/* Features Summary */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold">
              Your time is valuable. Get more out of meetings.
            </h2>
            <div className="mt-10 grid md:grid-cols-2 gap-8 text-left">
              <ul className="space-y-2 text-error list">
                <li>Lack of meeting structure</li>
                <li>Scattered tasks & duplication of work</li>
                <li>Poor task assignment & accountability</li>
                <li>Limited post-meeting task progress</li>
              </ul>
              <ul className="space-y-2 text-primary">
                <li>Enhance productivity with clear meeting systems</li>
                <li>Boost collaboration and task clarity</li>
                <li>Drive outcome with post-meeting task management</li>
              </ul>
            </div>
          </div>
        </section>

        {/* All in One Section */}
        <section className="py-20 px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold">All in one place</h2>
          <p className="mt-2 text-gray-600">
            Easily track attendees, agenda, and task outcomes.
          </p>
          <div className="mt-10 border rounded-xl shadow p-6 bg-white">
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              Meeting Agenda UI
            </div>
          </div>
        </section>

        {/* Task Tracking Section */}
        <section className="py-20 px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold">Never lose a task again</h2>
          <p className="mt-2 text-gray-600">
            Effortlessly assign, track, and resolve every coding task.
          </p>
          <div className="mt-10 border rounded-xl shadow p-6 bg-white">
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              Task View UI
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 px-4 text-center max-w-2xl mx-auto text-gray-700">
          <blockquote className="italic">
            "The connection between docs and discussions makes decision-making
            more efficient, transparent & contextualized."
          </blockquote>
          <p className="mt-4 font-semibold">– Morgan Williams, Co-founder</p>
        </section>

        {/* Feature Blocks */}
        <section className="py-20 px-4 bg-gray-50 max-w-6xl mx-auto grid gap-6 md:grid-cols-3 text-left mb-10">
          <div>
            <h4 className="font-semibold mb-2">Track attendance</h4>
            <p className="text-gray-600 text-sm">
              Assign roles, track participation, and improve team visibility.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Optimized for mobile</h4>
            <p className="text-gray-600 text-sm">
              Use SkillSync on the go and never miss a task again.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Assign & complete tasks</h4>
            <p className="text-gray-600 text-sm">
              Set clear goals and see tasks through completion.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="grid gap-5 items-center justify-center">
          <h2 className="text-2xl font-bold">
            Ready to make your meetings worthwhile?
          </h2>
          <button className="btn btn-secondary w-fit mx-auto">
            Get Started
          </button>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-sm text-gray-400">
          <p>&copy; 2025 SkillSync. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
