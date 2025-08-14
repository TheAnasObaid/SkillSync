import PortfolioList from "@/components/Profile/PortfolioList";
import ProfileView from "@/components/Profile/ProfileView";
import Reputation from "@/components/Profile/Reputation";
import { getPublicUserProfile } from "@/lib/data/users";
import { IUser } from "@/types";
import { Suspense } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

const UserProfilePage = async ({ params }: Props) => {
  const { id } = await params;
  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <ProfileDataLoader userId={id} />
    </Suspense>
  );
};

const ProfileDataLoader = async ({ userId }: { userId: string }) => {
  const user = await getPublicUserProfile(userId);

  if (!user) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">User Not Found</h1>
        <p className="text-base-content/70">
          This user profile could not be found or is not public.
        </p>
      </div>
    );
  }

  const portfolio = (user.profile?.portfolio ||
    []) as IUser["profile"]["portfolio"];

  return (
    <div className="max-w-4xl w-full mx-auto py-12 px-4 space-y-12">
      <ProfileView user={user} />
      <Reputation user={user} />
      <PortfolioList initialPortfolio={portfolio} profileOwnerId={user._id} />
    </div>
  );
};

const UserProfileSkeleton = () => (
  <div className="max-w-4xl w-full mx-auto py-12 px-4 space-y-12 animate-pulse">
    <div className="card bg-base-200/50">
      <div className="card-body p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="skeleton w-24 h-24 rounded-full"></div>
        <div className="flex-1 space-y-3">
          <div className="skeleton h-8 w-48"></div>
          <div className="skeleton h-4 w-32"></div>
          <div className="skeleton h-4 w-56"></div>
        </div>
      </div>
    </div>
    <div className="skeleton h-32 w-full"></div>
    <div>
      <div className="skeleton h-8 w-40 mb-6"></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="skeleton h-72 w-full"></div>
        <div className="skeleton h-72 w-full"></div>
        <div className="skeleton h-72 w-full"></div>
      </div>
    </div>
  </div>
);

export default UserProfilePage;
