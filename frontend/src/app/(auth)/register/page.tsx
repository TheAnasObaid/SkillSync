import RegisterForm from "@/components/Auth/RegisterForm";
import { Suspense } from "react";

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center w-full p-4">
      <Suspense
        fallback={<span className="loading loading-spinner loading-lg" />}
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
};

export default RegisterPage;
