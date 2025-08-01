import { FiArchive, FiCheckSquare, FiClipboard } from "react-icons/fi";
import AdminStatCard from "../Admin/AdminStatCard";
import { ClientStats } from "@/types";

interface Props {
  stats: ClientStats;
}

const ClientStatsCard = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AdminStatCard
        icon={<FiArchive size={32} />}
        label="Total Challenges"
        value={stats.totalChallengesPosted}
      />
      <AdminStatCard
        icon={<FiCheckSquare size={32} />}
        label="Active Challenges"
        value={stats.activeChallenges}
      />
      <AdminStatCard
        icon={<FiClipboard size={32} />}
        label="Submissions Received"
        value={stats.totalSubmissionsReceived}
      />
    </div>
  );
};

export default ClientStatsCard;
