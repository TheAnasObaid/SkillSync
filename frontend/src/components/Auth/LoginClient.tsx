"use client";

import LoginForm from "@/components/Auth/LoginForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";

const LoginClientComponent = () => {
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered");

  return (
    <div className="max-w-md w-full space-y-6">
      {isRegistered && (
        <div className="alert alert-success">
          <FiCheckCircle />
          <div>
            <h3 className="font-bold">Registration Successful!</h3>
            <div className="text-xs">
              You can now sign in to your new account.
            </div>
          </div>
        </div>
      )}

      <div className="card bg-base-200/50 border border-base-300 w-full shadow-lg">
        <div className="card-body p-8">
          <h1 className="card-title text-2xl font-bold justify-center mb-4">
            Welcome Back
          </h1>
          <LoginForm />
        </div>
      </div>

      <div className="text-center text-sm text-base-content/70">
        <p>
          Don't have an account yet?{" "}
          <Link href="/register" className="link link-primary font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginClientComponent;
