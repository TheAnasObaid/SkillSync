"use client";

import { Role } from "@/types";
import Link from "next/link";
import { FiGitBranch, FiLogIn, FiInfo } from "react-icons/fi";

interface CtaBlockProps {
  role: Role | null;
  onOpenModal: () => void;
}

const CtaBlock = ({ role, onOpenModal }: CtaBlockProps) => {
  if (role === "developer") {
    return (
      <div className="card bg-primary/10 border border-primary/20 text-center">
        <div className="card-body p-6">
          <h3 className="card-title text-primary justify-center">
            Ready to Compete?
          </h3>
          <p className="text-sm text-base-content/80">
            Submit your solution to showcase your skills and win the prize.
          </p>
          <div className="card-actions justify-center mt-4">
            <button className="btn btn-primary btn-block" onClick={onOpenModal}>
              <FiGitBranch /> Submit Your Solution
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (role === "client") {
    return (
      <div className="alert alert-info alert-soft">
        <FiInfo />
        <div>
          <h3 className="font-bold">Client View</h3>
          <div className="text-xs">
            You are viewing this challenge as a client. Only developers can
            compete.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200/50 border border-base-300 text-center">
      <div className="card-body p-6">
        <h3 className="card-title justify-center">Join the Challenge</h3>
        <p className="text-sm text-base-content/70">
          Log in as a developer to submit your solution.
        </p>
        <div className="card-actions justify-center mt-4">
          <Link href="/login" className="btn btn-primary btn-outline btn-block">
            <FiLogIn /> Login to Submit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CtaBlock;
