import { DeveloperStats } from "@/types";
import { FiAward, FiClipboard, FiClock } from "react-icons/fi";
import StatCard from "../Admin/StatCard";

interface Props {
  stats: DeveloperStats;
}

const DeveloperStatCard = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        icon={<FiClipboard size={32} />}
        label="Total Submissions"
        value={stats.totalSubmissions}
      />
      <StatCard
        icon={<FiAward size={32} />}
        label="Challenges Won"
        value={stats.winningSubmissions}
      />
      <StatCard
        icon={<FiClock size={32} />}
        label="Pending Reviews"
        value={stats.pendingReviews}
      />
    </div>
  );
};

export default DeveloperStatCard;
