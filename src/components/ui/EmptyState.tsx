import type { ReactNode } from "@tanstack/react-router";
import React from "react";

interface EmptyStateProps {
  icon: ReactNode; // Pass an SVG icon component
  title: string;
  description: string;
  action?: ReactNode; // Pass a button or link component
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
        {/* The icon will be rendered here */}
        <div className="text-primary w-12 h-12">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-base-content">{title}</h3>
      <p className="mt-2 text-base-content/70">{description}</p>

      {/* Conditionally render the action button */}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
