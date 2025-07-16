"use client";

import ProtectedRoute from "@/app/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/utils/api-client";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  prize: number;
  status: "open" | "closed";
  createdAt: string;
}

const ProfilePage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const { setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const { data } = await apiClient.get("/challenges");
        setChallenges(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChallenges();
  }, []);

  return (
    <ProtectedRoute requiredRole="client">
      <div className="p-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold">Client Dashboard</h1>
          <Link href="profile/challenge" className="btn btn-secondary">
            Create Challenge
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Challenge</th>
                <th>Status</th>
                <th>Prize</th>
                <th>Start date</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((challenge, index) => (
                <tr key={challenge._id}>
                  <th>{(index += 1)}</th>
                  <td className="font-semibold">{challenge.title}</td>
                  <td>
                    <span className="badge badge-primary">
                      {challenge.status}
                    </span>
                  </td>
                  <td className="font-semibold">${challenge.prize}</td>
                  <td>{challenge.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
