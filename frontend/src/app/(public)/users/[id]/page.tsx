import PortfolioList from "@/components/Profile/PortfolioList";
import ProfileView from "@/components/Profile/ProfileView";
import Reputation from "@/components/Profile/Reputation";
import { getPublicUserProfile } from "@/services/server/userService";

interface Props {
  params: Promise<{ id: string }>;
}

const UserProfilePage = async ({ params }: Props) => {
  const { id } = await params;
  const user = await getPublicUserProfile(id);

  if (!user) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">User Not Found</h1>
        <p className="text-base-content/70">
          This user profile could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto py-12 px-4 space-y-12">
      <ProfileView user={user} />
      <Reputation user={user} />
      <PortfolioList
        initialPortfolio={user.profile?.portfolio || []}
        profileOwnerId={user._id}
      />
    </div>
  );
};

export default UserProfilePage;
