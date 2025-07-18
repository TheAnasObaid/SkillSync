"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-5">
      <h2 className="text-4xl font-semibold">Home</h2>
      <Link href="/challenges" className="link link-hover link-secondary">
        View challenges
      </Link>
    </div>
  );
}
