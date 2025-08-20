import { ReactNode } from "react";
import StatCard from "./StatCard";

export interface StatItem {
  icon: ReactNode;
  label: string;
  value: number | string;
  link?: string;
  linkText?: string;
  color?: "green" | "blue" | "orange" | "red";
}

interface Props {
  stats: StatItem[];
}

const StatCardGrid = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          color={stat.color}
          link={stat.link}
          linkText={stat.linkText}
        />
      ))}
    </div>
  );
};

export default StatCardGrid;
