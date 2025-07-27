"use client";

import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import ChallengeForm from "@/components/Challenge/ChallengeForm";
import ClientChallengeList from "@/components/Challenge/ClientChallengeList";
import Link from "next/link";
import { useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";

const tabs = [
  { label: "My Challenges", value: "challenges" },
  { label: "Create Challenge", value: "create" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("challenges");

  return (
    <ProtectedRoute requiredRole="client">
      <div className="min-h-screen grid grid-cols-[250px_1fr]">
        {/* Sidebar */}
        <div className="bg-base-200 p-4 flex flex-col">
          <Link href="/" className="btn btn-ghost justify-start mb-6">
            <IoReturnUpBack size={20} />
            Back to Home
          </Link>
          <ul className="menu menu-vertical text-lg">
            {tabs.map((tab) => (
              <li key={tab.value} onClick={() => setActiveTab(tab.value)}>
                <a className={activeTab === tab.value ? "active" : ""}>
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="p-8">
          {activeTab === "challenges" && <ClientChallengeList />}
          {activeTab === "create" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Create a New Challenge
              </h2>
              <ChallengeForm />
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
