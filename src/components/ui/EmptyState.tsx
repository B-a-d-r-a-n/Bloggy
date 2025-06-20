import type { ReactNode } from "@tanstack/react-router";
interface EmptyStateProps {
  icon: ReactNode; 
  title: string;
  description: string;
  action?: ReactNode; 
}
export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center bg-base-200 p-8 rounded-lg border-2 border-dashed border-base-300">
      <div className="inline-block p-4 bg-base-300/50 rounded-full mb-4">
        {}
        <div className="text-primary w-12 h-12">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-base-content">{title}</h3>
      <p className="mt-2 text-base-content/70">{description}</p>
      {}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}