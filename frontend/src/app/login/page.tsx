"use client";

import LoginForm from "@/components/Auth/LoginForm";
import AuthLayout from "@/components/Layout/AuthLayout";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered");

  return (
    <AuthLayout>
      {isRegistered && (
        <div className="p-3 mb-6 text-center text-success-content bg-success/20 rounded-md">
          Registration successful! Please sign in to continue.
        </div>
      )}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome Back to SkillSync</h1>
      </div>
      <div className="divider my-6" />
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
