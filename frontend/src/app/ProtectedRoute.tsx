"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "developer" | "client";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { token, role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    } else if (requiredRole && role !== requiredRole) {
      router.replace("/");
    }
  }, [token, role]);

  return <div>{children}</div>;
};

export default ProtectedRoute;
