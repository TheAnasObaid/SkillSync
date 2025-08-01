import DeveloperProfile from "@/components/Profile/DeveloperProfile";
import { getMyProfileServer } from "@/services/server/userService";
import { redirect } from "next/navigation";

const DeveloperProfilePage = async () => {
  const user = await getMyProfileServer();

  if (!user) {
    redirect("/login");
  }

  return <DeveloperProfile initialUser={user} />;
};

export default DeveloperProfilePage;
