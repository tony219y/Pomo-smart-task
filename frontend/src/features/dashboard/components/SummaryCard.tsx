import { type LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

const SummaryCard = ({ title, value, icon: Icon }: SummaryCardProps) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-4xl font-medium tracking-tight text-foreground">
          <span className="text-2xl">{value}</span>
        </p>
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/15">
          <Icon className="text-primary" />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
