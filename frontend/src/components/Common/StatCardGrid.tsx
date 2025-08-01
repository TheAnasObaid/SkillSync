import { StatCardProps } from "@/types";
import StatCard from "./StatCard";

export type StatItem = StatCardProps;

interface Props {
  stats: StatItem[];
  loading?: boolean;
}

const StatCardGrid = async ({ stats, loading = false }: Props) => {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-40 w-full"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 w-full">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex-1 basis-full sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.33%-1rem)]"
        >
          <StatCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            // link={stat.link}
            // linkText={stat.linkText}
          />
        </div>
      ))}
    </div>
  );
};

export default StatCardGrid;
