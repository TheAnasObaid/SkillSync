"use client";

import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const VerifyEmailPage = () => {
  const { token } = useParams() as { token: string };
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState(
    "Verifying your email, please wait..."
  );

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        const response = await apiClient.get(`/auth/verify-email/${token}`);
        setStatus("success");
        setMessage(response.data.message);
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification failed. The link may be invalid or expired."
        );
      }
    };
    verify();
  }, [token]);

  // A helper to render content based on status
  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <FiCheckCircle className="text-primary text-6xl" />
            <h1 className="text-2xl font-bold">Email Verified!</h1>
            <p className="text-base-content/70">{message}</p>
            <Link href="/login" className="btn btn-primary mt-4">
              Proceed to Login
            </Link>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <FiXCircle className="text-error text-6xl" />
            <h1 className="text-2xl font-bold">Verification Failed</h1>
            <p className="text-base-content/70">{message}</p>
            <Link href="/register" className="btn btn-error btn-outline">
              Register Again
            </Link>
          </div>
        );
      case "verifying":
      default:
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <h1 className="text-2xl font-bold mt-4">{message}</h1>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md w-full mx-auto grid my-10 p-8 bg-base-200/50 rounded-lg shadow-md border border-base-300">
      {renderContent()}
    </div>
  );
};

export default VerifyEmailPage;
