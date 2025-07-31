import PortfolioList from "@/components/Profile/PortfolioList";
import ProfileView from "@/components/Profile/ProfileView";
import { getPublicUserProfile } from "@/services/server/userService";
import { FiAward } from "react-icons/fi";

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
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <ProfileView user={user} />

      <div className="card bg-base-200/50 border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-xl mb-4 flex items-center gap-2">
            <FiAward /> Reputation
          </h3>
          <div className="stats stats-vertical lg:stats-horizontal shadow bg-transparent">
            <div className="stat">
              <div className="stat-title">Avg. Rating</div>
              <div className="stat-value text-primary">
                {user.reputation?.rating.toFixed(1) || "N/A"} ★
              </div>
              <div className="stat-desc">
                From {user.reputation?.completedChallenges || 0} reviews
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Challenges Won</div>
              <div className="stat-value text-secondary">
                {user.reputation?.completedChallenges || 0}
              </div>
              <div className="stat-desc">Total successful projects</div>
            </div>
          </div>
        </div>
      </div>

      <PortfolioList
        initialPortfolio={user.profile?.portfolio || []}
        profileOwnerId={user._id}
      />
    </div>
  );
};

export default UserProfilePage;
