"use client";

import RegisterForm from "@/components/Auth/RegisterForm";
import Link from "next/link";

const RegisterClientComponent = () => {
  return (
    // We use a `space-y-6` container to manage spacing between the card and the footer link.
    <div className="max-w-md w-full space-y-6">
      <div className="card bg-base-200/50 border border-base-300 w-full shadow-lg">
        <div className="card-body p-8">
          <h1 className="card-title text-2xl font-bold justify-center mb-4">
            Create Your Account
          </h1>
          <RegisterForm />
        </div>
      </div>

      {/* --- CALL TO ACTION FOOTER --- */}
      <div className="text-center text-sm text-base-content/70">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="link link-primary font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterClientComponent;
