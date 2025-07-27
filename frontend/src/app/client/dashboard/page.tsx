"use client";

import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
      <div className="min-h-screen flex bg-base-100">
        <div className="w-64 p-6">
          <div role="tablist" className="tabs flex flex-col tabs-vertical">
            <button
              className={`tab justify-start ${
                activeTab === "general" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("general")}
            >
              General
            </button>
            <button
              className={`tab justify-start ${
                activeTab === "about" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
            <button
              className={`tab justify-start ${
                activeTab === "project" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("project")}
            >
              Add Project
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10">
          {activeTab === "general" && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold mb-6">General Settings</h2>

              {/* Profile Image + Remove */}
              <div className="flex items-center gap-4 mb-6">
                <div className="avatar">
                  <div className="w-20 rounded-full">
                    <img src="https://i.pravatar.cc/100" alt="Profile" />
                  </div>
                </div>
                <button className="btn btn-outline btn-sm">Remove image</button>
              </div>

              {/* Form Fields */}
              <div className="form-control mb-4">
                <label className="label font-medium">Username*</label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="morgan"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label font-medium">Display Name*</label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Morgan Williams"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label font-medium">Location*</label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="London, UK"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label font-medium">
                  Header{" "}
                  <span className="text-sm opacity-60 ml-1">(0 of 80)</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="A short headline"
                />
              </div>

              <button className="btn btn-primary mt-4">Done</button>
            </div>
          )}

          {activeTab === "about" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">About You</h2>
              <p className="text-gray-500">
                This is the About section content.
              </p>
            </div>
          )}

          {activeTab === "project" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Add Project</h2>
              <p className="text-gray-500">
                This is where you can add a new project.
              </p>
            </div>
          )}
        </div>
      </div>
      );
    </ProtectedRoute>
  );
};

export default Dashboard;
