import ProtectedRoute from "@/components/Auth/ProtectedRoute";
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
      <div className="grid gap-5">
        <h2 className="text-2xl font-bold">Client</h2>
        <Link href="/challenges/create" className="btn btn-secondary">
          Create Challenge
        </Link>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
