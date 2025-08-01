import { DeveloperStats } from "@/types";
import { FiAward, FiClipboard, FiClock } from "react-icons/fi";
import AdminStatCard from "../Admin/AdminStatCard";

interface Props {
  stats: DeveloperStats;
}

const DeveloperStatCard = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AdminStatCard
        icon={<FiClipboard size={32} />}
        label="Total Submissions"
        value={stats.totalSubmissions}
      />
      <AdminStatCard
        icon={<FiAward size={32} />}
        label="Challenges Won"
        value={stats.winningSubmissions}
      />
      <AdminStatCard
        icon={<FiClock size={32} />}
        label="Pending Reviews"
        value={stats.pendingReviews}
      />
    </div>
  );
};

export default DeveloperStatCard;
