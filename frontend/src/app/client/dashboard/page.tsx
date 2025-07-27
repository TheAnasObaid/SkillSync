"use client";

import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import ChallengeForm from "@/components/Challenge/ChallengeForm";
import Link from "next/link";
import { useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  prize: number;
  status: "open" | "closed";
  createdAt: string;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("general");
  return (
    <ProtectedRoute requiredRole="client">
      <div className="grid grid-cols-3 bg-base-100">
        <div className="w-64 px-4">
          <div role="tablist" className="tabs grid tabs-vertical">
            <Link href="/" className="mb-3 w-fit tab justify-start">
              <IoReturnUpBack size={24} />
            </Link>
            <button
              className={`tab justify-start font-semibold ${
                activeTab === "general" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("general")}
            >
              General
            </button>
            <button
              className={`tab justify-start font-semibold ${
                activeTab === "about" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
            <button
              className={`tab justify-start font-semibold ${
                activeTab === "project" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("project")}
            >
              Add Challenge
            </button>
          </div>
        </div>

        <div className="flex justify-content p-4">
          {activeTab === "general" && (
            <div className="w-full grid gap-3">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-24 rounded-full">
                    <img src="https://i.pravatar.cc/100" alt="Profile" />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="label font-semibold">Display Name</label>
                <input readOnly className="input w-full" type="text" />
              </div>
              <div className="grid gap-2">
                <label className="label font-semibold">Email</label>
                <input readOnly className="input w-full" type="text" />
              </div>
              <div className="grid gap-2">
                <label className="label font-semibold">Bio</label>
                <textarea readOnly className="textarea w-full" />
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="w-full grid gap-3">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-24 rounded-full">
                    <img src="https://i.pravatar.cc/100" alt="Profile" />
                  </div>
                </div>
                <button className="btn btn-outline btn-sm">Upload image</button>
              </div>
              <div className="grid gap-2">
                <label className="label font-semibold">First Name</label>
                <input className="input w-full" type="text" />
              </div>
              <div className="grid gap-2">
                <label className="label font-semibold">Last Name</label>
                <input className="input w-full" type="text" />
              </div>
              <div className="grid gap-2">
                <label className="label font-semibold">Bio</label>
                <textarea className="textarea w-full" />
              </div>
              <div className="grid gap-2">
                <label className="label font-semibold">Portfolio</label>
                <input className="input w-full" type="text" />
              </div>
              <div className="grid gap-2">
                <label className="label font-semibold">Experience</label>
                <input className="input w-full" type="text" />
              </div>
              <div className="grid gap-2">
                <label className="label font-semibold">Social Links</label>
                <input className="input w-full" type="text" />
              </div>
              <button className="btn btn-secondary btn-outline w-fit">
                Update
              </button>
            </div>
          )}

          {activeTab === "project" && (
            <div className="w-full grid gap-3">
              <ChallengeForm />
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
