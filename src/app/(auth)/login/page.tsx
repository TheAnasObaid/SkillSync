import LoginForm from "@/components/Auth/LoginForm";
import { Suspense } from "react";

const LoginPage = async () => {
  return (
    <div className="flex flex-col w-full items-center p-4">
      <Suspense
        fallback={<span className="loading loading-spinner loading-lg" />}
      >
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;
