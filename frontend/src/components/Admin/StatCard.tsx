import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
}

const StatCard = ({ icon, label, value }: StatCardProps) => {
  return (
    <div className={`card bg-base-200 shadow-md`}>
      <div className="card-body flex-row items-center gap-4">
        <div className="text-primary">{icon}</div>
        <div>
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-base-content/70">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
