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
        <ul className="flex gap-3">
          <li>
            <Link href="/login" className="btn btn-primary btn-outline">
              Login
            </Link>
          </li>
          <li>
            <Link href="/register" className="btn btn-primary">
              Register
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ButtonGroup;
