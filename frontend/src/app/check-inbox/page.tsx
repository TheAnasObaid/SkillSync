"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FiMail } from "react-icons/fi";

const CheckInboxContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="max-w-md mx-auto my-10 text-center p-8 bg-base-200/50 rounded-lg shadow-md border border-base-300">
      <div className="mx-auto w-fit p-4 bg-primary/10 rounded-full">
        <FiMail className="text-primary text-4xl" />
      </div>
      <h1 className="text-2xl font-bold mt-6">Check Your Inbox</h1>
      <p className="text-base-content/70 mt-4">
        We've sent a verification link to the email address:
        <br />
        <strong className="text-base-content/90 font-semibold">{email}</strong>
      </p>
      <p className="text-sm text-base-content/60 mt-4">
        Please click the link in that email to complete your registration. If
        you don't see it, be sure to check your spam folder.
      </p>
    </div>
  );
};

const CheckInboxPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckInboxContent />
    </Suspense>
  );
};

export default CheckInboxPage;
