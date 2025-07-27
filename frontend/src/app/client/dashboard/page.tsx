"use client";

import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import ChallengeForm from "@/components/Challenge/ChallengeForm";
import AboutTab from "@/components/Profile/AboutTab";
import AddProjectTab from "@/components/Profile/AddProjectTab";
import GeneralTab from "@/components/Profile/GeneralTab";
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
  const tabs = [
    { label: "General", value: "general" },
    { label: "About", value: "about" },
    { label: "Add Challenge", value: "project" },
  ];

  return (
    <ProtectedRoute requiredRole="client">
      <div className="grid grid-cols-3 bg-base-100">
        <div className="w-64 px-4">
          <div role="tablist" className="tabs grid tabs-vertical">
            <Link href="/" className="mb-3 w-fit tab justify-start">
              <IoReturnUpBack size={24} />
            </Link>
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`tab justify-start font-semibold ${
                  activeTab === tab.value ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-content p-4">
          {activeTab === "general" && <GeneralTab />}
          {activeTab === "about" && <AboutTab />}
          {activeTab === "project" && <AddProjectTab />}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
