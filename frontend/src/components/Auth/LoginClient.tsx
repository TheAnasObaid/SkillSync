"use client";

import LoginForm from "@/components/Auth/LoginForm";
import { useSearchParams } from "next/navigation";

const LoginClientComponent = () => {
  // All the logic that uses the client-side hook is now safely inside this component
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered");

  return (
    <div className="grid gap-5 max-w-sm w-full my-10 mx-auto">
      {isRegistered && (
        <div className="alert alert-success alert-soft">
          Registration successful! Please sign in to continue.
        </div>
      )}
      <h1 className="text-center text-2xl font-bold border-b border-base-300/100 pb-10">
        Welcome Back to SkillSync
      </h1>
      <LoginForm />
    </div>
  );
};

export default LoginClientComponent;
