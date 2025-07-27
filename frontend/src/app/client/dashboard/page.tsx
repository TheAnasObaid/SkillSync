"use client";

import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Image from "next/image";
import Link from "next/link";

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  prize: number;
  status: "open" | "closed";
  createdAt: string;
}

const Dashboard = () => {
  return (
    <ProtectedRoute requiredRole="client">
      <div className="grid grid-cols-4 gap-5">
        <aside className="p-5">
          <ul className="menu">
            <li>
              <Link href="#">General</Link>
            </li>
            <li>
              <Link href="#">About</Link>
            </li>
            <li>
              <Link href="/challenges/create">Create Challenge</Link>
            </li>
          </ul>
        </aside>
        <div className="col-span-3 p-5">
          <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
            <div className="flex items-center gap-5 ">
              <Image
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fG1vZGVsfGVufDB8fDB8fHww"
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full h-28 w-28 object-cover"
              />
              <button className="btn btn-secondary btn-sm">Update image</button>
            </div>

            <form className="grid gap-5 w-full">
              <div className="grid gap-2">
                <label className="label font-semibold">Username</label>
                <input className="input w-full" type="text" />
              </div>
              <div className="grid gap-2">
                <label className="label font-semibold">Email</label>
                <input className="input w-full" type="text" />
              </div>
              <div className="grid gap-2">
                <label className="label font-semibold">Bio</label>
                <textarea className="textarea w-full" />
              </div>
              <button
                type="submit"
                className="btn btn-secondary btn-outline w-fit"
              >
                Edit
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
