import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";
import { Suspense } from "react";

const ResetPasswordPage = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <Suspense
        fallback={<span className="loading loading-spinner loading-lg" />}
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;
