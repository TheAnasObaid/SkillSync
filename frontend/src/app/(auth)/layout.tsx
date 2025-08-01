import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-base-200/50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
