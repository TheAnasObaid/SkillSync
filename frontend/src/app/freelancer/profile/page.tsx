"use client";

import { Challenge } from "@/app/client/profile/page";
import ProtectedRoute from "@/app/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/utils/api-client";
import { useEffect, useState } from "react";

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
    <ProtectedRoute requiredRole="developer">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Developer Dashboard</h1>
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
