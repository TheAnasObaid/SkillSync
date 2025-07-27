"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const ButtonGroup = () => {
  const { loading, token } = useAuthStore();

  if (loading) return <span className="loading loading-spinner" />;

  return (
    <div>
      {token ? (
        <LogoutButton />
      ) : (
        <Link href="/register" className="btn btn-secondary">
          Get Started
        </Link>
      )}
    </div>
  );
};

export default ButtonGroup;
