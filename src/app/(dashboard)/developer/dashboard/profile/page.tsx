import DeveloperProfile from "@/components/Profile/DeveloperProfile";
import { Suspense } from "react";

const DeveloperProfilePage = () => {
  return (
    <Suspense fallback={<p>Loading Profile...</p>}>
      <DeveloperProfile />
    </Suspense>
  );
};

export default DeveloperProfilePage;
