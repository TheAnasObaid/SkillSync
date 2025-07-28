import { ReactNode } from "react";
import MinimalHeader from "./MinimalHeader";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
      <MinimalHeader />
      <div className="w-full max-w-md px-8 py-10">{children}</div>
    </div>
  );
};

export default AuthLayout;
