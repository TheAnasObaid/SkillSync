import AdminProfileClient from "@/components/Admin/AdminProfileClient";
import { Suspense } from "react";

const AdminProfilePage = () => {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <AdminProfileClient />
    </Suspense>
  );
};

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="skeleton h-24 w-full"></div>
    <div className="skeleton h-48 w-full"></div>
  </div>
);

export default AdminProfilePage;
