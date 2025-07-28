import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid bg-base-100">
      <div className="w-full max-w-md mx-auto py-10">{children}</div>
    </div>
  );
};

export default AuthLayout;
