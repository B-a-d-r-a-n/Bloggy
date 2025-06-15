import React, { type InputHTMLAttributes } from "react";
import type { UseFormRegister } from "react-hook-form";
import { cn } from "../../lib/utils.ts"; // A utility for merging class names (from shadcn)

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register: UseFormRegister<any>; // Receive the register function
  error?: string;
}

export default function Input({
  label,
  name,
  register,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        {...register(name)} // Spread the register props here
        {...props}
        className={cn(
          "input input-bordered w-full",
          error && "input-error", // Apply error class if there's an error
          className
        )}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
