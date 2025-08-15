import { IUser } from "@/types";
import { FiAward } from "react-icons/fi";

interface Props {
  user: IUser;
}

const Reputation = ({ user }: Props) => {
  return (
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
            {/* FIX: Changed from completedChallenges to totalRatings for accuracy */}
            <div className="stat-desc">
              From {user.reputation?.totalRatings || 0} reviews
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
  );
};

export default Reputation;
