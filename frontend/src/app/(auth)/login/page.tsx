import LoginClientComponent from "@/components/Auth/LoginClient";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <Suspense fallback={<div className="loading loading-spinner" />}>
      <LoginClientComponent />
    </Suspense>
  );
};

export default LoginPage;
