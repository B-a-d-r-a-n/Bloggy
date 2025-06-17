import React, { useId } from "react";
import { cn } from "../../lib/utils";

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

export function FormSelect({ label, children, ...props }: FormSelectProps) {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-base-content/90 mb-1.5"
      >
        {label}
      </label>
      <select
        id={id}
        {...props}
        className={cn(
          "select select-bordered w-full",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-base-100"
        )}
      >
        {children}
      </select>
    </div>
  );
}
