import LoginClientComponent from "@/components/Auth/LoginClient";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Suspense
        fallback={<span className="loading loading-spinner loading-lg" />}
      >
        <LoginClientComponent />
      </Suspense>
    </div>
  );
};

export default LoginPage;
