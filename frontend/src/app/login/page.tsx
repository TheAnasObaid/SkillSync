"use client";

import LoginForm from "@/components/Auth/LoginForm";
import AuthLayout from "@/components/Layout/AuthLayout";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered");

  return (
    <AuthLayout>
      <div className="grid gap-5">
        {isRegistered && (
          <div className="alert alert-success alert-soft">
            Registration successful! Please sign in to continue.
          </div>
        )}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back to SkillSync</h1>
          <div className="divider" />
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
