import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-5 flex flex-col items-center text-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}
