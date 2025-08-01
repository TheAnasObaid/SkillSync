import RegisterClientComponent from "@/components/Auth/RegisterClient";
import { Suspense } from "react";

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Suspense
        fallback={<span className="loading loading-spinner loading-lg" />}
      >
        <RegisterClientComponent />
      </Suspense>
    </div>
  );
};

export default RegisterPage;
