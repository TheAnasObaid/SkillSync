import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";
import { Suspense } from "react";

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <Suspense
        fallback={<span className="loading loading-spinner loading-lg" />}
      >
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
};

export default ForgotPasswordPage;
