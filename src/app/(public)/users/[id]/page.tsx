import PortfolioList from "@/components/Profile/PortfolioList";
import ProfileView from "@/components/Profile/ProfileView";
import Reputation from "@/components/Profile/Reputation";
import { getPublicUserProfile } from "@/lib/data/users";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";

// Define the exact shape of the public user profile data
const publicUserProfile = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    firstName: true,
    lastName: true,
    avatarUrl: true,
    bio: true,
    skills: true,
    experience: true,
    rating: true,
    totalRatings: true,
    completedChallenges: true,
    portfolio: true,
  },
});

interface Props {
  params: Promise<{ id: string }>;
}

const ProfileDataLoader = async ({ userId }: { userId: string }) => {
  const user = await getPublicUserProfile(userId);

  if (!user) {
    notFound();
  }

  const portfolio = user.portfolio || [];

  return (
    <div className="max-w-4xl w-full mx-auto py-12 px-4 space-y-12">
      <ProfileView user={user as any} />
      <Reputation user={user} />
      <PortfolioList initialPortfolio={portfolio} profileOwnerId={user.id} />
    </div>
  );
};

const UserProfilePage = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <ProfileDataLoader userId={id} />
    </Suspense>
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
